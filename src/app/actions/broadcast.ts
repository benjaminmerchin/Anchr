"use server";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

import { generateHeyGenVideo } from "@/lib/heygen";
import {
  getHyperspellForCurrentUser,
  getInstalledSources,
  searchMemories,
} from "@/lib/hyperspell";
import {
  generateAnchorScript,
  generateNewsroomScript,
  type ScriptTone,
} from "@/lib/script-gen";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export type GenerateBroadcastResult =
  | { ok: true; broadcastId: Id<"broadcasts">; videoUrl: string }
  | {
      ok: false;
      stage: "auth" | "story" | "script" | "video";
      message: string;
    };

/**
 * Generate a broadcast for the given story end-to-end:
 *   1. fetch the story from Convex
 *   2. generate the spoken script with OpenAI
 *   3. submit + poll HeyGen until the video is rendered
 *   4. store the result on the matching `broadcasts` row
 *
 * Long-running — relies on Vercel's 300s default function timeout.
 */
export async function generateBroadcast(
  storyId: Id<"stories">,
  options: { tone?: ScriptTone } = {},
): Promise<GenerateBroadcastResult> {
  const token = await convexAuthNextjsToken();
  if (!token) {
    return { ok: false, stage: "auth", message: "Not authenticated" };
  }

  let story;
  try {
    story = await fetchQuery(
      api.stories.list,
      {},
      { token },
    ).then((rows) => rows.find((s) => s._id === storyId));
  } catch (err) {
    return {
      ok: false,
      stage: "story",
      message: err instanceof Error ? err.message : String(err),
    };
  }
  if (!story) {
    return { ok: false, stage: "story", message: "Story not found" };
  }

  let script: string;
  try {
    script = await generateAnchorScript(
      {
        title: story.title,
        summary: story.summary,
        sourceKind: story.sourceKind,
        evidence: story.evidence,
      },
      { tone: options.tone },
    );
  } catch (err) {
    return {
      ok: false,
      stage: "script",
      message: err instanceof Error ? err.message : String(err),
    };
  }

  const broadcastId = await fetchMutation(
    api.broadcasts.startRendering,
    { storyId, title: story.title, script },
    { token },
  );

  try {
    const { videoUrl, thumbnailUrl } = await generateHeyGenVideo(script);
    await fetchMutation(
      api.broadcasts.setReady,
      { broadcastId, videoUrl, ...(thumbnailUrl ? { thumbnailUrl } : {}) },
      { token },
    );
    return { ok: true, broadcastId, videoUrl };
  } catch (err) {
    await fetchMutation(
      api.broadcasts.setFailed,
      { broadcastId },
      { token },
    ).catch(() => undefined);
    return {
      ok: false,
      stage: "video",
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Stub: mark a broadcast as "published" without actually pushing it to any
 * social platform. We display fake share URLs in the UI so the dashboard
 * tells a complete end-to-end story for the demo.
 */
export async function publishBroadcast(
  broadcastId: Id<"broadcasts">,
): Promise<void> {
  const token = await convexAuthNextjsToken();
  if (!token) throw new Error("Not authenticated");
  await fetchMutation(api.broadcasts.markPublished, { broadcastId }, { token });
}

export type GenerateNewsroomResult =
  | { ok: true; broadcastId: Id<"broadcasts">; videoUrl: string }
  | {
      ok: false;
      stage: "auth" | "context" | "script" | "video";
      message: string;
    };

/**
 * Generate the daily "newsroom" broadcast — scans all of the user's connected
 * Hyperspell sources, runs the investigative-anchor prompt over what comes
 * back, and renders the result with HeyGen.
 */
export async function generateNewsroomBroadcast(): Promise<GenerateNewsroomResult> {
  const token = await convexAuthNextjsToken();
  if (!token) {
    return { ok: false, stage: "auth", message: "Not authenticated" };
  }

  // 1. Pull a corpus of documents from Hyperspell, scoped to whichever
  //    integrations the user actually connected.
  let documents: Array<{ source?: string; title?: string; content?: string }> = [];
  try {
    const { client, userId } = await getHyperspellForCurrentUser();
    const sources = await getInstalledSources(client);
    if (sources.length > 0) {
      const broadQueries = [
        "What's the most important thing happening at the company right now?",
        "Any product, pricing, or roadmap changes?",
        "Any internal disagreements, leadership decisions, or growth pressure?",
      ];
      const results = await Promise.all(
        broadQueries.map((q) =>
          searchMemories(userId, q, { sources, answer: false }).catch(
            () => ({ documents: [] }),
          ),
        ),
      );
      const seen = new Set<string>();
      for (const r of results) {
        for (const d of r.documents ?? []) {
          const doc = d as Record<string, unknown>;
          const key = String(
            doc.id ?? doc.uri ?? doc.title ?? JSON.stringify(doc),
          );
          if (seen.has(key)) continue;
          seen.add(key);
          documents.push({
            source: typeof doc.source === "string" ? doc.source : undefined,
            title:
              typeof doc.title === "string"
                ? doc.title
                : typeof doc.uri === "string"
                  ? doc.uri
                  : undefined,
            content:
              typeof doc.content === "string"
                ? doc.content
                : typeof doc.text === "string"
                  ? doc.text
                  : typeof doc.snippet === "string"
                    ? doc.snippet
                    : undefined,
          });
        }
      }
    }
  } catch (err) {
    return {
      ok: false,
      stage: "context",
      message: err instanceof Error ? err.message : String(err),
    };
  }

  // 2. Newsroom script via OpenAI.
  let title: string;
  let script: string;
  try {
    const generated = await generateNewsroomScript(documents);
    title = generated.title;
    script = generated.script;
  } catch (err) {
    return {
      ok: false,
      stage: "script",
      message: err instanceof Error ? err.message : String(err),
    };
  }

  const broadcastId = await fetchMutation(
    api.broadcasts.startRendering,
    { title, script },
    { token },
  );

  // 3. HeyGen renders the avatar reading the script.
  try {
    const { videoUrl, thumbnailUrl } = await generateHeyGenVideo(script);
    await fetchMutation(
      api.broadcasts.setReady,
      { broadcastId, videoUrl, ...(thumbnailUrl ? { thumbnailUrl } : {}) },
      { token },
    );
    return { ok: true, broadcastId, videoUrl };
  } catch (err) {
    await fetchMutation(
      api.broadcasts.setFailed,
      { broadcastId },
      { token },
    ).catch(() => undefined);
    return {
      ok: false,
      stage: "video",
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
