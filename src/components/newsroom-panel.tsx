"use client";

import { useMutation, useQuery } from "convex/react";
import { useState, useTransition } from "react";
import { Clock, Loader2, Sparkles } from "lucide-react";

import { generateNewsroomBroadcast } from "@/app/actions/broadcast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "../../convex/_generated/api";

/**
 * Compact "control bar" for newsroom broadcasts. Generates a new one on
 * demand and lets the user opt-in to a daily auto-broadcast at a chosen UTC
 * time (off by default). The library of past videos lives in a separate
 * BroadcastLibrary component.
 */
export function NewsroomPanel() {
  const latest = useQuery(api.broadcasts.getLatestNewsroom);
  const schedule = useQuery(api.schedules.getMine);
  const upsertSchedule = useMutation(api.schedules.upsert);

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [savingSchedule, setSavingSchedule] = useState(false);

  const enabled = schedule?.enabled ?? false;
  const [time, setTime] = useState(schedule?.timeOfDayUTC ?? "09:00");

  const isRendering =
    latest?.status === "rendering" || latest?.status === "scripting";

  function generate() {
    setError(null);
    startTransition(async () => {
      const result = await generateNewsroomBroadcast();
      if (!result.ok) {
        setError(`${result.stage}: ${result.message}`);
      }
    });
  }

  async function setSchedule(nextEnabled: boolean, nextTime: string) {
    setSavingSchedule(true);
    try {
      await upsertSchedule({ enabled: nextEnabled, timeOfDayUTC: nextTime });
    } finally {
      setSavingSchedule(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            Newsroom
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-white md:text-2xl">
            Generate a{" "}
            <span className="font-serif italic font-normal">broadcast</span>
            .
          </h2>
          <p className="mt-1 text-sm text-white/55">
            Anchr scans every connected source, writes a 60-second anchor
            script, and renders the video. ~60–120s end to end.
          </p>
        </div>
        <Button
          onClick={generate}
          disabled={pending || isRendering}
          size="sm"
          className="rounded-full bg-white text-xs text-black hover:bg-white/90"
        >
          {pending || isRendering ? (
            <>
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles className="mr-1.5 size-3.5" />
              Generate now
            </>
          )}
        </Button>
      </div>

      {error ? (
        <p className="mt-3 text-xs text-red-300/90">{error}</p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-black/30 px-4 py-3">
        <Clock className="size-3.5 text-white/45" />
        <p className="text-xs text-white/70">
          <span className="font-medium text-white">Daily auto-broadcast</span>{" "}
          — runs at <span className="font-mono text-white/80">{time} UTC</span>
        </p>
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs text-white/70">
          <input
            type="checkbox"
            checked={enabled}
            disabled={savingSchedule}
            onChange={(e) => setSchedule(e.target.checked, time)}
            className="h-3.5 w-3.5 cursor-pointer accent-white"
          />
          <span className="font-mono text-[10px] uppercase tracking-widest">
            {enabled ? "on" : "off"}
          </span>
        </label>
        <Input
          type="time"
          value={time}
          disabled={savingSchedule}
          onChange={(e) => setTime(e.target.value)}
          onBlur={() => {
            if (time !== schedule?.timeOfDayUTC) setSchedule(enabled, time);
          }}
          className="h-7 w-[110px] border-white/10 bg-white/[0.04] text-xs text-white"
        />
      </div>
    </section>
  );
}
