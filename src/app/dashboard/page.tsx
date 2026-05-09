"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { Database, GitBranch, Mail, MessageSquare, Sparkles } from "lucide-react";

import { AnchrChat } from "@/components/anchr-chat";
import { AnchrLogo } from "@/components/anchr-logo";
import { HyperspellConnectButton } from "@/components/hyperspell-connect-button";
import { Button } from "@/components/ui/button";
import { getHyperspellToken } from "@/app/actions/hyperspell";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";

const SOURCE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  github: GitBranch,
  slack: MessageSquare,
  gmail: Mail,
  notion: Database,
};

function relativeTime(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.round(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export default function DashboardPage() {
  const { signOut } = useAuthActions();
  const router = useRouter();
  const stories = useQuery(api.stories.list);
  const seedDemo = useMutation(api.stories.seedDemo);

  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white">
      <header className="sticky top-0 z-30 w-full border-b border-white/5 bg-black/60 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <AnchrLogo />
          <div className="flex items-center gap-2">
            <HyperspellConnectButton getToken={getHyperspellToken} />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => seedDemo()}
              className="rounded-full border border-white/15 bg-white/[0.03] text-xs text-white/80 hover:bg-white/[0.08] hover:text-white"
            >
              <Sparkles className="mr-1 size-3.5" />
              Seed demo stories
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
              className="rounded-full text-xs text-white/60 hover:bg-white/10 hover:text-white"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
              Newsroom
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
              Stories worth{" "}
              <span className="font-serif italic font-normal">
                broadcasting
              </span>
              .
            </h1>
          </div>
        </div>

        <div className="mt-8">
          <AnchrChat />
        </div>

        <div className="mt-10 grid gap-3">
          {stories === undefined ? (
            <p className="text-sm text-white/40">Loading stories…</p>
          ) : stories.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] py-20 text-center">
              <p className="text-sm text-white/55">
                No stories yet. Connect a source — or start with sample data.
              </p>
              <Button
                onClick={() => seedDemo()}
                className="mt-5 rounded-full bg-white text-sm text-black hover:bg-white/90"
              >
                <Sparkles className="mr-1 size-4" />
                Seed demo stories
              </Button>
            </div>
          ) : (
            stories.map((s) => {
              const Icon = SOURCE_ICON[s.sourceKind] ?? Database;
              return (
                <div
                  key={s._id}
                  className={cn(
                    "group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.04]",
                  )}
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/[0.04]">
                    <Icon className="size-4 text-white/80" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-white">
                        {s.title}
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">
                        {s.sourceKind} · {relativeTime(s.detectedAt)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                      {s.summary}
                    </p>
                    {s.evidence.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {s.evidence.map((e) => (
                          <span
                            key={e}
                            className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-white/50"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                      {Math.round(s.score * 100)}
                    </span>
                    <Button
                      size="sm"
                      className="rounded-full bg-white text-xs text-black hover:bg-white/90"
                    >
                      Broadcast
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
