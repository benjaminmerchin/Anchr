"use server";

import { getHyperspellForCurrentUser } from "@/lib/hyperspell";

/**
 * Server action: mint a short-lived Hyperspell user token for the signed-in
 * viewer. The frontend hands this token to `connect.hyperspell.com` so the
 * user can authorize their own accounts (Gmail, Slack, GitHub, Notion, ...).
 */
export async function getHyperspellToken(): Promise<string> {
  if (!process.env.HYPERSPELL_API_KEY) {
    throw new Error("HYPERSPELL_API_KEY is not configured on the server");
  }

  let client: Awaited<
    ReturnType<typeof getHyperspellForCurrentUser>
  >["client"];
  let userId: string;
  try {
    ({ client, userId } = await getHyperspellForCurrentUser());
  } catch (err) {
    throw new Error(
      `Could not resolve Anchr viewer: ${err instanceof Error ? err.message : err}`,
    );
  }

  try {
    const response = await client.auth.userToken({ user_id: userId });
    return response.token;
  } catch (err) {
    throw new Error(
      `Hyperspell userToken failed for user ${userId}: ${
        err instanceof Error ? err.message : err
      }`,
    );
  }
}
