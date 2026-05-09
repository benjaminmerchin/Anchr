import { v } from "convex/values";

import { auth } from "./auth";
import { mutation, query } from "./_generated/server";

/**
 * Get the current viewer's schedule. Returns the row or `null` if the user
 * has never set one — in which case the dashboard should default to disabled.
 */
export const getMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("schedules")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

/**
 * Upsert the viewer's schedule. Disabled by default — call this only when
 * the user explicitly toggles it on or changes the time.
 */
export const upsert = mutation({
  args: {
    enabled: v.boolean(),
    timeOfDayUTC: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("schedules")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        enabled: args.enabled,
        timeOfDayUTC: args.timeOfDayUTC,
      });
      return existing._id;
    }

    return await ctx.db.insert("schedules", {
      userId,
      enabled: args.enabled,
      timeOfDayUTC: args.timeOfDayUTC,
    });
  },
});
