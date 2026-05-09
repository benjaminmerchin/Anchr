"use client";

import { useMutation, useQuery } from "convex/react";
import { useState, useTransition } from "react";
import {
  CheckCircle2,
  Camera,
  Clock,
  Film,
  Loader2,
  Music,
  Play,
  Radio,
  Sparkles,
} from "lucide-react";

import {
  generateNewsroomBroadcast,
  publishBroadcast,
} from "@/app/actions/broadcast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

function mockUrls(broadcastId: string) {
  const slug = broadcastId.slice(-8);
  return {
    youtube: `https://youtube.com/shorts/${slug}`,
    tiktok: `https://tiktok.com/@anchr/video/${slug}`,
    instagram: `https://instagram.com/reel/${slug}`,
  };
}

export function NewsroomPanel() {
  const broadcast = useQuery(api.broadcasts.getLatestNewsroom);
  const schedule = useQuery(api.schedules.getMine);
  const upsertSchedule = useMutation(api.schedules.upsert);

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  // Local schedule UI state. Defaults to disabled until the user toggles it.
  const enabled = schedule?.enabled ?? false;
  const [time, setTime] = useState(schedule?.timeOfDayUTC ?? "09:00");
  const [savingSchedule, setSavingSchedule] = useState(false);

  const status = broadcast?.status;
  const isRendering = status === "rendering" || status === "scripting";

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
            Today&apos;s newsroom
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-white md:text-2xl">
            Your daily{" "}
            <span className="font-serif italic font-normal">broadcast</span>.
          </h2>
          <p className="mt-1 text-sm text-white/55">
            One 60-second video summarizing the most interesting things across
            all your connected sources.
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

      {/* Player */}
      {broadcast?.status === "ready" && broadcast.videoUrl ? (
        <ReadyPlayer
          broadcastId={broadcast._id}
          videoUrl={broadcast.videoUrl}
          publishedAt={broadcast.publishedAt}
          publishing={publishing}
          onPublish={async () => {
            setPublishing(true);
            try {
              await publishBroadcast(broadcast._id);
            } finally {
              setPublishing(false);
            }
          }}
        />
      ) : isRendering ? (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
          <Loader2 className="size-4 animate-spin text-white/80" />
          <div>
            <p className="font-medium text-white">Rendering your newsroom…</p>
            <p className="text-xs text-white/45">
              Reading your sources, writing the script, then HeyGen renders the
              anchor. Usually 60–120s total.
            </p>
          </div>
        </div>
      ) : null}

      {/* Scheduling */}
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-black/30 px-4 py-3">
        <Clock className="size-3.5 text-white/45" />
        <p className="text-xs text-white/70">
          <span className="font-medium text-white">Daily auto-broadcast</span>{" "}
          — runs at{" "}
          <span className="font-mono text-white/80">{time} UTC</span>
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

function ReadyPlayer({
  broadcastId,
  videoUrl,
  publishedAt,
  publishing,
  onPublish,
}: {
  broadcastId: Id<"broadcasts">;
  videoUrl: string;
  publishedAt: number | undefined;
  publishing: boolean;
  onPublish: () => void;
}) {
  const urls = mockUrls(broadcastId);
  const published = Boolean(publishedAt);
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-black">
      <video
        src={videoUrl}
        controls
        playsInline
        className="aspect-video w-full bg-black"
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          <Radio className="size-3" />
          newsroom · ready
        </div>
        {published ? (
          <PublishedBadges urls={urls} videoUrl={videoUrl} />
        ) : (
          <div className="flex items-center gap-2">
            <a
              href={videoUrl}
              download
              className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs text-white/80 hover:bg-white/[0.08] hover:text-white"
            >
              Download
            </a>
            <Button
              onClick={onPublish}
              disabled={publishing}
              size="sm"
              className="rounded-full bg-white text-xs text-black hover:bg-white/90"
            >
              {publishing ? (
                <Loader2 className="mr-1 size-3.5 animate-spin" />
              ) : (
                <Play className="mr-1 size-3.5 fill-current" />
              )}
              Publish to all
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function PublishedBadges({
  urls,
  videoUrl,
}: {
  urls: { youtube: string; tiktok: string; instagram: string };
  videoUrl: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
        <CheckCircle2 className="size-3" />
        live
      </span>
      <a
        href={urls.youtube}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-white/75 hover:text-white"
      >
        <Film className="size-3" /> YouTube
      </a>
      <a
        href={urls.tiktok}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-white/75 hover:text-white"
      >
        <Music className="size-3" /> TikTok
      </a>
      <a
        href={urls.instagram}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-white/75 hover:text-white"
      >
        <Camera className="size-3" /> Instagram
      </a>
      <a
        href={videoUrl}
        download
        className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-white/75 hover:text-white"
      >
        Download
      </a>
    </div>
  );
}
