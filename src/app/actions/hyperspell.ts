"use server";

import {
  getCurrentUserId,
  getHyperspellAdminClient,
} from "@/lib/hyperspell";

export type HyperspellTokenResult =
  | { ok: true; token: string }
  | {
      ok: false;
      stage: "env" | "auth" | "hyperspell";
      message: string;
      keyShape?: { present: boolean; length: number; prefix: string };
    };

function describeKey() {
  const k = process.env.HYPERSPELL_API_KEY ?? "";
  return {
    present: k.length > 0,
    length: k.length,
    // First 4 chars are enough to confirm "hs2-" prefix without leaking
    prefix: k.slice(0, 4),
  };
}

/**
 * Server action: mint a short-lived Hyperspell user token for the signed-in
 * viewer. Returns a discriminated result so the client can surface the actual
 * failure stage instead of Next.js's redacted production error message.
 */
export async function getHyperspellToken(): Promise<HyperspellTokenResult> {
  const keyShape = describeKey();
  console.log("[hyperspell] keyShape", keyShape);

  if (!keyShape.present) {
    return {
      ok: false,
      stage: "env",
      message: "HYPERSPELL_API_KEY is not configured on the server.",
      keyShape,
    };
  }

  let userId: string;
  try {
    userId = await getCurrentUserId();
  } catch (err) {
    return {
      ok: false,
      stage: "auth",
      message: err instanceof Error ? err.message : String(err),
      keyShape,
    };
  }

  try {
    const client = getHyperspellAdminClient();
    const response = await client.auth.userToken({ user_id: userId });
    return { ok: true, token: response.token };
  } catch (err) {
    return {
      ok: false,
      stage: "hyperspell",
      message: err instanceof Error ? err.message : String(err),
      keyShape,
    };
  }
}
