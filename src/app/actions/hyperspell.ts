"use server";

import {
  getCurrentUserId,
  getHyperspellAdminClient,
} from "@/lib/hyperspell";

export type HyperspellTokenResult =
  | { ok: true; token: string }
  | { ok: false; stage: "env" | "auth" | "hyperspell"; message: string };

/**
 * Server action: mint a short-lived Hyperspell user token for the signed-in
 * viewer. Returns a discriminated result so the client can surface the actual
 * failure stage instead of Next.js's redacted production error message.
 */
export async function getHyperspellToken(): Promise<HyperspellTokenResult> {
  if (!process.env.HYPERSPELL_API_KEY) {
    return {
      ok: false,
      stage: "env",
      message: "HYPERSPELL_API_KEY is not configured on the server.",
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
    };
  }

  // auth.userToken requires the platform API key with NO user scope.
  // Calling it through a user-scoped client returns 401.
  try {
    const client = getHyperspellAdminClient();
    const response = await client.auth.userToken({ user_id: userId });
    return { ok: true, token: response.token };
  } catch (err) {
    return {
      ok: false,
      stage: "hyperspell",
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
