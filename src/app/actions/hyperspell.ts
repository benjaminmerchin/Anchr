"use server";

import { getHyperspellForCurrentUser } from "@/lib/hyperspell";

/**
 * Server action: mint a short-lived Hyperspell user token for the signed-in
 * viewer. The frontend hands this token to `connect.hyperspell.com` so the
 * user can authorize their own accounts (Gmail, Slack, GitHub, Notion, ...).
 */
export async function getHyperspellToken(): Promise<string> {
  const { client, userId } = await getHyperspellForCurrentUser();

  const response = await client.auth.userToken({
    user_id: userId,
  });

  return response.token;
}
