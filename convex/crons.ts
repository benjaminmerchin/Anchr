import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";

const crons = cronJobs();

// Scan once an hour for schedules whose configured timeOfDayUTC matches the
// current hour. For matching, enabled schedules we record a `lastRunAt`
// timestamp — the actual newsroom render is triggered by a hosted webhook
// because the render needs a user-scoped Convex auth token (the cron context
// is unauthenticated).
crons.interval(
  "scan-newsroom-schedules",
  { minutes: 60 },
  internal.crons.scanSchedules,
);

export default crons;

import { internalAction } from "./_generated/server";

export const scanSchedules = internalAction({
  args: {},
  handler: async (ctx) => {
    const schedules = await ctx.runQuery(internal.crons.listEnabledSchedules);

    const nowUTC = new Date();
    const currentHour = nowUTC.getUTCHours();

    for (const s of schedules) {
      const [hh] = s.timeOfDayUTC.split(":");
      const target = Number(hh);
      if (Number.isNaN(target) || target !== currentHour) continue;

      // Mark that a run was attempted for this user. The actual render is
      // triggered separately (e.g. by a hosted webhook with a signed token);
      // tracking the timestamp here lets the dashboard show "next run".
      await ctx.runMutation(internal.crons.markRun, {
        scheduleId: s._id,
      });
    }
  },
});

import { internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const listEnabledSchedules = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("schedules")
      .filter((q) => q.eq(q.field("enabled"), true))
      .collect();
  },
});

export const markRun = internalMutation({
  args: { scheduleId: v.id("schedules") },
  handler: async (ctx, { scheduleId }) => {
    await ctx.db.patch(scheduleId, { lastRunAt: Date.now() });
  },
});
