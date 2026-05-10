import { fetchMutation, fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

import { pollHeyGenVideo } from "@/lib/heygen";
import { api } from "../../../../../convex/_generated/api";

export const runtime = "nodejs";

/**
 * One-shot backfill for the `thumbnailUrl` field on existing broadcasts.
 * Hit GET /api/admin/backfill-thumbnails while signed in — it walks your
 * broadcasts, extracts the HeyGen video_id from the stored video_url, asks
 * HeyGen for the matching thumbnail_url, and patches the row.
 */
export async function GET() {
  const token = await convexAuthNextjsToken();
  if (!token) {
    return Response.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const broadcasts = await fetchQuery(api.broadcasts.list, {}, { token });

  const results: Array<{
    id: string;
    title: string;
    status: "skipped" | "updated" | "no-id" | "no-thumbnail" | "error";
    detail?: string;
  }> = [];

  for (const b of broadcasts) {
    if (b.thumbnailUrl) {
      results.push({ id: b._id, title: b.title, status: "skipped" });
      continue;
    }
    if (!b.videoUrl) {
      results.push({ id: b._id, title: b.title, status: "skipped" });
      continue;
    }

    const videoId = extractHeyGenVideoId(b.videoUrl);
    if (!videoId) {
      results.push({ id: b._id, title: b.title, status: "no-id" });
      continue;
    }

    try {
      const data = await pollHeyGenVideo(videoId);
      const thumbnailUrl = data?.thumbnail_url;
      if (!thumbnailUrl) {
        results.push({ id: b._id, title: b.title, status: "no-thumbnail" });
        continue;
      }
      await fetchMutation(
        api.broadcasts.setThumbnail,
        { broadcastId: b._id, thumbnailUrl },
        { token },
      );
      results.push({ id: b._id, title: b.title, status: "updated" });
    } catch (err) {
      results.push({
        id: b._id,
        title: b.title,
        status: "error",
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return Response.json({ ok: true, results });
}

/**
 * Pull the HeyGen video_id out of a stored video URL. HeyGen serves clips
 * from a few CDN paths, all of which include the GUID in the path or query
 * string. We try a permissive set of patterns and stop at the first match.
 */
function extractHeyGenVideoId(url: string): string | null {
  const patterns: RegExp[] = [
    // .../files2.heygen.ai/.../<video_id>.mp4
    /\/([0-9a-f]{32})\.mp4(?:\?|$)/i,
    /\/([0-9a-f-]{36})\.mp4(?:\?|$)/i,
    // .../resource2.heygen.ai/video/<video_id>/...
    /\/video\/([0-9a-f-]{20,40})\//i,
    // generic GUID-ish anywhere in the path
    /\/([0-9a-f]{32})(?:[/?]|$)/i,
    /\/([0-9a-f-]{36})(?:[/?]|$)/i,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}
