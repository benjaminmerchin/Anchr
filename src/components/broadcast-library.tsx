"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import {
  Camera,
  CheckCircle2,
  Clock,
  Film,
  Loader2,
  Music,
  Play,
  Radio,
} from "lucide-react";

import { publishBroadcast } from "@/app/actions/broadcast";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

function mockUrls(broadcastId: string) {
  const slug = broadcastId.slice(-8);
  return {
    youtube: `https://youtube.com/shorts/${slug}`,
    tiktok: `https://tiktok.com/@anchr/video/${slug}`,
    instagram: `https://instagram.com/reel/${slug}`,
  };
}

function relative(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export function BroadcastLibrary() {
  const broadcasts = useQuery(api.broadcasts.list);
  const [openId, setOpenId] = useState<Id<"broadcasts"> | null>(null);

  if (broadcasts === undefined) {
    return (
      <p className="text-sm text-white/40">Loading library…</p>
    );
  }

  if (broadcasts.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] py-16 text-center">
        <p className="text-sm text-white/55">
          No broadcasts yet. Generate one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {broadcasts.map((b) => (
        <BroadcastCard
          key={b._id}
          broadcast={b}
          open={openId === b._id}
          onToggle={() =>
            setOpenId(openId === b._id ? null : b._id)
          }
        />
      ))}
    </div>
  );
}

function BroadcastCard({
  broadcast,
  open,
  onToggle,
}: {
  broadcast: Doc<"broadcasts">;
  open: boolean;
  onToggle: () => void;
}) {
  const [publishing, setPublishing] = useState(false);

  const status = broadcast.status;
  const ready = status === "ready" && Boolean(broadcast.videoUrl);
  const rendering = status === "rendering" || status === "scripting";
  const failed = status === "failed";

  async function publish() {
    setPublishing(true);
    try {
      await publishBroadcast(broadcast._id);
    } finally {
      setPublishing(false);
    }
  }

  const urls = mockUrls(broadcast._id);
  const published = Boolean(broadcast.publishedAt);
  const sourceLabel = broadcast.storyId ? "story" : "newsroom";

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition",
        ready && "hover:border-white/20",
      )}
    >
      {/* media area */}
      {ready ? (
        open ? (
          <video
            src={broadcast.videoUrl}
            controls
            playsInline
            autoPlay
            className="aspect-video w-full bg-black"
          />
        ) : (
          <button
            type="button"
            onClick={onToggle}
            className="group/play relative aspect-video w-full overflow-hidden bg-black"
          >
            {/* native preload renders the first frame as a poster */}
            <video
              src={broadcast.videoUrl}
              preload="metadata"
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover/play:opacity-100"
            />
            <div className="absolute inset-0 grid place-items-center">
              <div className="grid size-14 place-items-center rounded-full border border-white/30 bg-black/50 backdrop-blur transition group-hover/play:scale-110">
                <Play className="size-5 fill-white text-white" />
              </div>
            </div>
          </button>
        )
      ) : rendering ? (
        <div className="flex aspect-video w-full items-center justify-center bg-black/60">
          <div className="flex flex-col items-center gap-2 text-white/70">
            <Loader2 className="size-5 animate-spin" />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              rendering…
            </span>
          </div>
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-red-500/5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-red-300/80">
            {failed ? "render failed" : status}
          </span>
        </div>
      )}

      {/* footer */}
      <div className="flex flex-col gap-3 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-white">
              {broadcast.title}
            </h3>
            <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
              <Radio className="size-3" />
              {sourceLabel}
              <span className="text-white/20">·</span>
              <Clock className="size-3" />
              {relative(broadcast._creationTime)}
            </div>
          </div>
          {published ? (
            <span className="flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
              <CheckCircle2 className="size-3" />
              live
            </span>
          ) : null}
        </div>

        {ready && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <a
              href={broadcast.videoUrl}
              download
              className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-white/80 hover:bg-white/[0.08] hover:text-white"
            >
              Download
            </a>
            {published ? (
              <>
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
              </>
            ) : (
              <button
                type="button"
                onClick={publish}
                disabled={publishing}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black hover:bg-white/90 disabled:opacity-50"
              >
                {publishing ? "Publishing…" : "Publish to all"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
