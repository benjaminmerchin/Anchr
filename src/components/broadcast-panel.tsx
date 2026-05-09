"use client";

import { useMutation, useQuery } from "convex/react";
import { useState, useTransition } from "react";
import {
  Camera,
  CheckCircle2,
  Film,
  Loader2,
  Music,
  Play,
  Radio,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import {
  generateBroadcast,
  publishBroadcast,
} from "@/app/actions/broadcast";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface Props {
  storyId: Id<"stories">;
  storyStatus: string;
}

// Mock share URLs for the publish stub. Each Anchr broadcast gets a fake
// presence on the major short-form platforms — purely for the demo.
function mockUrls(broadcastId: string) {
  const slug = broadcastId.slice(-8);
  return {
    youtube: `https://youtube.com/shorts/${slug}`,
    tiktok: `https://tiktok.com/@anchr/video/${slug}`,
    instagram: `https://instagram.com/reel/${slug}`,
  };
}

export function BroadcastPanel({ storyId }: Props) {
  const broadcast = useQuery(api.broadcasts.getForStory, { storyId });
  const seedRetryReset = useMutation(api.broadcasts.setFailed);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  function start() {
    setError(null);
    startTransition(async () => {
      const result = await generateBroadcast(storyId);
      if (!result.ok) {
        setError(`${result.stage}: ${result.message}`);
      }
    });
  }

  async function publish() {
    if (!broadcast) return;
    setPublishing(true);
    try {
      await publishBroadcast(broadcast._id);
    } finally {
      setPublishing(false);
    }
  }

  // Loading the row from Convex.
  if (broadcast === undefined) {
    return null;
  }

  // No broadcast yet, or failed — show the trigger button.
  if (broadcast === null || broadcast.status === "failed") {
    return (
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          onClick={start}
          disabled={pending}
          size="sm"
          className="rounded-full bg-white text-xs text-black hover:bg-white/90"
        >
          {pending ? (
            <>
              <Loader2 className="mr-1 size-3.5 animate-spin" />
              Starting…
            </>
          ) : broadcast?.status === "failed" ? (
            <>
              <RefreshCw className="mr-1 size-3.5" />
              Retry broadcast
            </>
          ) : (
            <>
              <Sparkles className="mr-1 size-3.5" />
              Generate broadcast
            </>
          )}
        </Button>
        {error ? (
          <span className="text-xs text-red-300/90">{error}</span>
        ) : broadcast?.status === "failed" ? (
          <span className="text-xs text-red-300/80">
            Last render failed — try again
          </span>
        ) : null}
      </div>
    );
  }

  // Currently rendering on HeyGen.
  if (broadcast.status === "rendering" || broadcast.status === "scripting") {
    return (
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
        <Loader2 className="size-4 animate-spin text-white/80" />
        <div>
          <p className="font-medium text-white">Rendering broadcast…</p>
          <p className="text-xs text-white/45">
            HeyGen is rendering your anchor — usually 60–120s. You can leave this open.
          </p>
        </div>
        <button
          onClick={() => seedRetryReset({ broadcastId: broadcast._id })}
          className="ml-auto text-xs text-white/35 hover:text-white/70"
        >
          cancel
        </button>
      </div>
    );
  }

  // Ready — show the player + publish actions.
  if (broadcast.status === "ready" && broadcast.videoUrl) {
    const urls = mockUrls(broadcast._id);
    const published = Boolean(broadcast.publishedAt);
    return (
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black">
        <video
          src={broadcast.videoUrl}
          controls
          playsInline
          className="aspect-video w-full bg-black"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 bg-white/[0.02] px-4 py-3">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
            <Radio className="size-3" />
            broadcast · ready
          </div>
          {published ? (
            <PublishedBadges urls={urls} />
          ) : (
            <Button
              onClick={publish}
              disabled={publishing}
              size="sm"
              className={cn(
                "rounded-full bg-white text-xs text-black hover:bg-white/90",
              )}
            >
              {publishing ? (
                <Loader2 className="mr-1 size-3.5 animate-spin" />
              ) : (
                <Play className="mr-1 size-3.5 fill-current" />
              )}
              Publish to all
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
}

function PublishedBadges({
  urls,
}: {
  urls: { youtube: string; tiktok: string; instagram: string };
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
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
        <Film className="size-3" />
        YouTube
      </a>
      <a
        href={urls.tiktok}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-white/75 hover:text-white"
      >
        <Music className="size-3" />
        TikTok
      </a>
      <a
        href={urls.instagram}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-white/75 hover:text-white"
      >
        <Camera className="size-3" />
        Instagram
      </a>
    </div>
  );
}
