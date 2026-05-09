"use server";

import { getHyperspellForCurrentUser } from "@/lib/hyperspell";

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

  let resolved: Awaited<ReturnType<typeof getHyperspellForCurrentUser>>;
  try {
    resolved = await getHyperspellForCurrentUser();
  } catch (err) {
    return {
      ok: false,
      stage: "auth",
      message: err instanceof Error ? err.message : String(err),
    };
  }

  try {
    const response = await resolved.client.auth.userToken({
      user_id: resolved.userId,
    });
    return { ok: true, token: response.token };
  } catch (err) {
    return {
      ok: false,
      stage: "hyperspell",
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
