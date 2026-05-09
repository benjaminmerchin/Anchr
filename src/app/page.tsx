import { ArrowRight, Play, Radio, Sparkles, Zap } from "lucide-react";

import { AnchrLogo } from "@/components/anchr-logo";
import { FloatingShapes } from "@/components/shapes";
import { SourcePill } from "@/components/source-pill";
import { Button } from "@/components/ui/button";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import { Marquee } from "@/components/ui/marquee";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";

const SOURCES = ["Slack", "Gmail", "GitHub", "Notion", "Drive", "Calendar", "Linear"];

const STEPS = [
  {
    icon: Radio,
    title: "Connect",
    body:
      "Plug Slack, Gmail, GitHub and Notion into Hyperspell. Anchr ingests your team's pulse — every PR, every thread, every doc.",
  },
  {
    icon: Sparkles,
    title: "Detect",
    body:
      "An always-on agent scans for stories: features shipped, milestones hit, user feedback that matters. Nia keeps facts fresh and on-the-record.",
  },
  {
    icon: Zap,
    title: "Broadcast",
    body:
      "A polished video update — scripted in your voice, narrated by your AI anchor — ready to ship to TikTok, LinkedIn, or your team's inbox.",
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white">
      {/* Top nav */}
      <header className="sticky top-0 z-30 w-full border-b border-white/5 bg-black/60 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <AnchrLogo className="text-base" />
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/70 md:flex">
            <a href="#how" className="transition hover:text-white">
              How it works
            </a>
            <a href="#sources" className="transition hover:text-white">
              Sources
            </a>
            <a href="#stack" className="transition hover:text-white">
              Stack
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden text-sm text-white/80 hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              Sign in
            </Button>
            <Button
              variant="secondary"
              className="rounded-full bg-white text-sm font-medium text-black hover:bg-white/90"
            >
              Get started
              <ArrowRight className="ml-1 size-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate flex flex-1 items-center overflow-hidden">
        {/* Animated code-style grid */}
        <AnimatedGridPattern
          numSquares={40}
          maxOpacity={0.08}
          duration={3}
          repeatDelay={1}
          width={48}
          height={48}
          className={cn(
            "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
            "absolute inset-0 h-full w-full skew-y-0 fill-white/10 stroke-white/10",
          )}
        />

        {/* White shapes overlay */}
        <FloatingShapes />

        {/* Top fade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 md:py-32">
          <BlurFade delay={0.05} inView>
            <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-white" />
              </span>
              ON AIR — built for the Hyperspell × Nia hackathon
            </div>
          </BlurFade>

          <BlurFade delay={0.15} inView>
            <h1 className="text-balance text-center text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)] md:text-7xl">
              Your company has{" "}
              <span className="font-serif italic font-normal text-white">
                stories
              </span>
              .
              <br />
              Anchr tells them.
            </h1>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <p className="mx-auto mt-7 max-w-2xl text-balance text-center text-lg text-white/60 md:text-xl">
              Anchr turns your team's data into polished video updates —
              auto-generated, on-brand, ready to ship. No more silent shipping.
            </p>
          </BlurFade>

          <BlurFade delay={0.45} inView>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ShimmerButton
                shimmerColor="#ffffff"
                background="rgba(255,255,255,0.06)"
                className="px-7 py-3.5 text-sm font-medium"
              >
                <span className="flex items-center gap-2">
                  Start broadcasting
                  <ArrowRight className="size-4" />
                </span>
              </ShimmerButton>
              <Button
                variant="ghost"
                className="gap-2 px-6 py-6 text-white/80 hover:bg-white/5 hover:text-white"
              >
                <Play className="size-4 fill-current" />
                Watch a 60-second demo
              </Button>
            </div>
          </BlurFade>

          <BlurFade delay={0.6} inView>
            <p className="mt-12 text-center font-mono text-xs uppercase tracking-[0.18em] text-white/35">
              Powered by Hyperspell · Nia · Convex · Vercel AI Gateway
            </p>
          </BlurFade>
        </div>
      </section>

      {/* Sources marquee */}
      <section id="sources" className="relative border-y border-white/5 py-10">
        <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.18em] text-white/40">
          Listening across your stack
        </p>
        <Marquee className="[--duration:35s]" pauseOnHover>
          {SOURCES.map((s) => (
            <SourcePill key={s} name={s} />
          ))}
        </Marquee>
      </section>

      {/* How it works */}
      <section
        id="how"
        className="relative mx-auto w-full max-w-6xl px-6 py-28"
      >
        <BlurFade inView>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
            How it works
          </p>
          <h2 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
            From scattered signals to a finished broadcast.
          </h2>
        </BlurFade>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <BlurFade key={title} delay={0.1 * (i + 1)} inView>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 backdrop-blur transition duration-300 hover:border-white/20 hover:bg-white/[0.04]">
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl border border-white/15 bg-white/5">
                    <Icon className="size-5 text-white" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-white/40">
                    Step 0{i + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {body}
                </p>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Demo preview */}
      <section className="relative mx-auto w-full max-w-6xl px-6 pb-28">
        <BlurFade inView>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-2">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
              <div className="absolute inset-0 grid place-items-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="grid size-16 place-items-center rounded-full border border-white/20 bg-white/[0.06] backdrop-blur transition hover:scale-105">
                    <Play className="size-6 fill-white text-white" />
                  </div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/50">
                    Anchr · weekly broadcast · 02:14
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)] bg-[length:100%_4px]" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-red-300">
                <span className="size-1.5 animate-pulse rounded-full bg-red-400" />
                Live
              </div>
              <div className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-widest text-white/40">
                CH 01 · ANCHR
              </div>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* Final CTA */}
      <section
        id="stack"
        className="relative isolate mx-auto w-full max-w-6xl overflow-hidden px-6 pb-28"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center md:p-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-1/2 size-80 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -right-20 top-1/2 size-80 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
          </div>
          <h2 className="relative text-balance text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
            Stop shipping in{" "}
            <span className="font-serif italic font-normal">silence</span>.
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-balance text-white/60 md:text-lg">
            Connect your stack. We&apos;ll handle the rest. Your first broadcast
            goes out in under five minutes.
          </p>
          <div className="relative mt-10 flex justify-center">
            <ShimmerButton
              shimmerColor="#ffffff"
              background="rgba(255,255,255,0.06)"
              className="px-7 py-3.5 text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                Get on air
                <ArrowRight className="size-4" />
              </span>
            </ShimmerButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-xs text-white/40 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <AnchrLogo className="opacity-80" />
            <span className="hidden md:inline">·</span>
            <span>Built at the Hyperspell × Nia hackathon · 2026</span>
          </div>
          <div className="flex items-center gap-5">
            <a className="transition hover:text-white" href="#">
              GitHub
            </a>
            <a className="transition hover:text-white" href="#">
              Twitter
            </a>
            <a className="transition hover:text-white" href="#">
              Pitch deck
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
