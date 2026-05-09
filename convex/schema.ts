import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  /** A connected workspace data source (Slack, Gmail, GitHub, Notion...) */
  sources: defineTable({
    userId: v.id("users"),
    kind: v.union(
      v.literal("slack"),
      v.literal("gmail"),
      v.literal("github"),
      v.literal("notion"),
      v.literal("drive"),
      v.literal("calendar"),
      v.literal("linear"),
    ),
    label: v.string(),
    status: v.union(
      v.literal("connecting"),
      v.literal("connected"),
      v.literal("error"),
    ),
    /** Hyperspell connector reference */
    hyperspellId: v.optional(v.string()),
    lastSyncedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_kind", ["userId", "kind"]),

  /** A detected story / signal worth turning into a broadcast */
  stories: defineTable({
    userId: v.id("users"),
    title: v.string(),
    summary: v.string(),
    /** Where the signal originated */
    sourceKind: v.string(),
    /** Free-form refs (URLs, message ids, PR numbers...) */
    evidence: v.array(v.string()),
    /** Importance score from the detection agent */
    score: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("scripted"),
      v.literal("broadcasting"),
      v.literal("live"),
      v.literal("archived"),
    ),
    detectedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"])
    .index("by_user_detected", ["userId", "detectedAt"]),

  /** A generated broadcast (script + optional video). Tied to a story when
   * one triggered it, or `undefined` for newsroom-wide segments that scan
   * everything the user has connected. */
  broadcasts: defineTable({
    userId: v.id("users"),
    storyId: v.optional(v.id("stories")),
    title: v.string(),
    /** The narrated script the AI anchor reads */
    script: v.string(),
    /** Hosted MP4 / playback URL */
    videoUrl: v.optional(v.string()),
    /** Provider that rendered the video */
    videoProvider: v.optional(
      v.union(
        v.literal("remotion"),
        v.literal("heygen"),
        v.literal("tavus"),
      ),
    ),
    /** Duration in seconds */
    duration: v.optional(v.number()),
    status: v.union(
      v.literal("queued"),
      v.literal("scripting"),
      v.literal("rendering"),
      v.literal("ready"),
      v.literal("failed"),
    ),
    publishedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_story", ["storyId"])
    .index("by_user_status", ["userId", "status"]),

  /** Per-user schedule for the daily newsroom cron. Disabled by default. */
  schedules: defineTable({
    userId: v.id("users"),
    enabled: v.boolean(),
    /** "HH:MM" 24h time, interpreted as UTC. */
    timeOfDayUTC: v.string(),
    lastRunAt: v.optional(v.number()),
    lastBroadcastId: v.optional(v.id("broadcasts")),
  }).index("by_user", ["userId"]),
});
