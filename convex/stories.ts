import { v } from "convex/values";

import { auth } from "./auth";
import { mutation, query } from "./_generated/server";

/**
 * List all stories for the current user, newest first.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("stories")
      .withIndex("by_user_detected", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

/**
 * Insert a story (used by the detection agent — temporarily exposed
 * to the client for demo seeding).
 */
export const create = mutation({
  args: {
    title: v.string(),
    summary: v.string(),
    sourceKind: v.string(),
    evidence: v.array(v.string()),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("stories", {
      ...args,
      userId,
      status: "draft",
      detectedAt: Date.now(),
    });
  },
});

/**
 * Seed the current user with a few demo stories — useful for the
 * pitch so the dashboard isn't empty.
 */
export const seedDemo = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("stories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(1);
    if (existing.length > 0) return { seeded: false };

    const now = Date.now();
    await ctx.db.insert("stories", {
      userId,
      title: "Real-time collaboration shipped",
      summary:
        "After 3 weeks in beta, the live cursors + co-editing feature merged this morning. 47 internal users testing daily, zero rollbacks.",
      sourceKind: "github",
      evidence: ["PR #842", "@sasha", "+1,840 / -612"],
      score: 0.92,
      status: "draft",
      detectedAt: now - 1000 * 60 * 30,
    });
    await ctx.db.insert("stories", {
      userId,
      title: "1,000 teams crossed",
      summary:
        "Hit our 1k team milestone at 9:42 UTC. Top growth source this week: word-of-mouth from the design community on Twitter.",
      sourceKind: "slack",
      evidence: ["#general", "@founder", "metrics dashboard"],
      score: 0.88,
      status: "draft",
      detectedAt: now - 1000 * 60 * 60 * 5,
    });
    await ctx.db.insert("stories", {
      userId,
      title: "Customer love letter",
      summary:
        "Marie at Forge Studio sent a 4-paragraph email about how Anchr replaced their weekly internal newsletter. Worth quoting in the next broadcast.",
      sourceKind: "gmail",
      evidence: ["thread:8e2ac1", "marie@forgestudio.com"],
      score: 0.79,
      status: "draft",
      detectedAt: now - 1000 * 60 * 60 * 20,
    });

    return { seeded: true };
  },
});
