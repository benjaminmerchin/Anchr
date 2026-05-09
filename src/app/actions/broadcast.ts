"use server";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

import { generateHeyGenVideo } from "@/lib/heygen";
import { generateAnchorScript, type ScriptTone } from "@/lib/script-gen";
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
    const { videoUrl } = await generateHeyGenVideo(script);
    await fetchMutation(
      api.broadcasts.setReady,
      { broadcastId, videoUrl },
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
