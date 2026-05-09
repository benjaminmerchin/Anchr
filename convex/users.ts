import { getAuthUserId } from "@convex-dev/auth/server";

import { query } from "./_generated/server";

/**
 * Returns the Convex user ID of the currently authenticated viewer, or `null`
 * if the request is unauthenticated. Used by Hyperspell server actions to
 * mint per-user tokens.
 */
export const viewerId = query({
  args: {},
  handler: async (ctx) => {
    return await getAuthUserId(ctx);
  },
});
