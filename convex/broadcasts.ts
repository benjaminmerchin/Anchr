import { v } from "convex/values";

import { auth } from "./auth";
import { mutation, query } from "./_generated/server";

/**
 * List the current viewer's broadcasts, newest first.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("broadcasts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

/**
 * Look up the broadcast tied to a given story (if any).
 */
export const getForStory = query({
  args: { storyId: v.id("stories") },
  handler: async (ctx, { storyId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("broadcasts")
      .withIndex("by_story", (q) => q.eq("storyId", storyId))
      .first();
  },
});

/**
 * Create a broadcast in the rendering state. Called by the server action that
 * kicks off HeyGen — the action will later call `setReady` or `setFailed`.
 */
export const startRendering = mutation({
  args: {
    storyId: v.optional(v.id("stories")),
    title: v.string(),
    script: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("broadcasts", {
      userId,
      ...(args.storyId ? { storyId: args.storyId } : {}),
      title: args.title,
      script: args.script,
      videoProvider: "heygen",
      status: "rendering",
    });
  },
});

/**
 * The most recent newsroom-wide broadcast for the viewer (no storyId).
 */
export const getLatestNewsroom = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    const rows = await ctx.db
      .query("broadcasts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return rows.find((b) => b.storyId === undefined) ?? null;
  },
});

export const setReady = mutation({
  args: {
    broadcastId: v.id("broadcasts"),
    videoUrl: v.string(),
  },
  handler: async (ctx, { broadcastId, videoUrl }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db.get(broadcastId);
    if (!existing || existing.userId !== userId)
      throw new Error("Not authorized");
    await ctx.db.patch(broadcastId, {
      videoUrl,
      status: "ready",
      publishedAt: Date.now(),
    });
  },
});

export const setFailed = mutation({
  args: { broadcastId: v.id("broadcasts") },
  handler: async (ctx, { broadcastId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db.get(broadcastId);
    if (!existing || existing.userId !== userId)
      throw new Error("Not authorized");
    await ctx.db.patch(broadcastId, { status: "failed" });
  },
});

/**
 * Delete a broadcast row. Owner-only.
 */
export const remove = mutation({
  args: { broadcastId: v.id("broadcasts") },
  handler: async (ctx, { broadcastId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db.get(broadcastId);
    if (!existing) return;
    if (existing.userId !== userId) throw new Error("Not authorized");
    await ctx.db.delete(broadcastId);
  },
});

/**
 * Mark a broadcast as published (currently a stub — no real social posting
 * during the hackathon, just the UX).
 */
export const markPublished = mutation({
  args: { broadcastId: v.id("broadcasts") },
  handler: async (ctx, { broadcastId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db.get(broadcastId);
    if (!existing || existing.userId !== userId)
      throw new Error("Not authorized");
    await ctx.db.patch(broadcastId, {
      publishedAt: Date.now(),
    });
    // Flip the linked story to "live" if this broadcast came from one.
    if (existing.storyId) {
      await ctx.db.patch(existing.storyId, { status: "live" });
    }
  },
});
