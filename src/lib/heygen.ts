import "server-only";

const VIDEO_GENERATE_ENDPOINT =
  process.env.HEYGEN_VIDEO_GENERATE_ENDPOINT ??
  "https://api.heygen.com/v2/video/generate";
const STATUS_ENDPOINT =
  process.env.HEYGEN_STATUS_ENDPOINT ??
  "https://api.heygen.com/v1/video_status.get";

interface HeyGenSubmitResponse {
  data?: { video_id?: string };
  video_id?: string;
}

interface HeyGenStatusResponse {
  data?: {
    status?: "pending" | "processing" | "completed" | "failed";
    video_url?: string;
    error?: { message?: string; code?: number } | null;
  };
}

export interface SubmittedVideo {
  videoId: string;
}

export interface FinishedVideo {
  videoUrl: string;
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

export async function submitHeyGenVideo(script: string): Promise<SubmittedVideo> {
  const apiKey = requireEnv("HEYGEN_API_KEY");
  const avatarId = requireEnv("HEYGEN_AVATAR_ID");
  const voiceId = requireEnv("HEYGEN_VOICE_ID");

  const payload = {
    video_inputs: [
      {
        character: {
          type: "avatar",
          avatar_id: avatarId,
          avatar_style: "normal",
        },
        voice: {
          type: "text",
          input_text: script,
          voice_id: voiceId,
          speed: 1.0,
        },
      },
    ],
    dimension: { width: 1280, height: 720 },
  };

  const res = await fetch(VIDEO_GENERATE_ENDPOINT, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = (await res.json()) as HeyGenSubmitResponse;
  if (!res.ok) {
    throw new Error(
      `HeyGen submit failed (${res.status}): ${JSON.stringify(json)}`,
    );
  }
  const videoId = json.data?.video_id ?? json.video_id;
  if (!videoId) {
    throw new Error(
      `HeyGen submit returned no video_id: ${JSON.stringify(json)}`,
    );
  }
  return { videoId };
}

export async function pollHeyGenVideo(
  videoId: string,
): Promise<HeyGenStatusResponse["data"]> {
  const apiKey = requireEnv("HEYGEN_API_KEY");
  const url = new URL(STATUS_ENDPOINT);
  url.searchParams.set("video_id", videoId);

  const res = await fetch(url, {
    method: "GET",
    headers: { "X-API-KEY": apiKey },
  });
  const json = (await res.json()) as HeyGenStatusResponse;
  if (!res.ok) {
    throw new Error(
      `HeyGen poll failed (${res.status}): ${JSON.stringify(json)}`,
    );
  }
  return json.data;
}

/**
 * Submit a script and block until the video is rendered (or failed / timed
 * out). Suitable for a Vercel function with maxDuration up to 300s — HeyGen
 * usually finishes a 30-60s clip within 60-120s.
 */
export async function generateHeyGenVideo(
  script: string,
  options: { pollIntervalMs?: number; timeoutMs?: number } = {},
): Promise<FinishedVideo & { videoId: string }> {
  // Vercel's default function ceiling is 300s; leave a small margin so the
  // catch-block and Convex mutation can run before the runtime kills us.
  const { pollIntervalMs = 4000, timeoutMs = 280_000 } = options;

  const { videoId } = await submitHeyGenVideo(script);
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    await new Promise((r) => setTimeout(r, pollIntervalMs));
    const data = await pollHeyGenVideo(videoId);
    const status = data?.status;
    if (status === "completed" && data?.video_url) {
      return { videoId, videoUrl: data.video_url };
    }
    if (status === "failed") {
      throw new Error(
        `HeyGen rendering failed: ${data?.error?.message ?? "unknown"}`,
      );
    }
  }

  throw new Error(
    `HeyGen rendering timed out after ${timeoutMs}ms (videoId=${videoId})`,
  );
}
