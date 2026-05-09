import Link from "next/link";
import {
  ArrowRight,
  Brain,
  GitPullRequest,
  Megaphone,
  Mic,
  Play,
  Plug2,
  Send,
  Sparkles,
  Telescope,
} from "lucide-react";

import { AnchrLogo } from "@/components/anchr-logo";
import { DataFlow } from "@/components/data-flow";
import { ScriptPreview } from "@/components/script-preview";
import { FloatingShapes } from "@/components/shapes";
import { SourcePill } from "@/components/source-pill";
import { Button, buttonVariants } from "@/components/ui/button";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import { Marquee } from "@/components/ui/marquee";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

const SOURCES = [
  "Slack",
  "Gmail",
  "GitHub",
  "Notion",
  "Drive",
  "Calendar",
  "Linear",
];

const STEPS = [
  {
    icon: Plug2,
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
    icon: Send,
    title: "Broadcast",
    body:
      "A polished video update — scripted in your voice, narrated by your AI anchor — ready to ship to TikTok, LinkedIn, or your team's inbox.",
  },
];

const STATS: Array<{
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}> = [
  { value: 12, suffix: "+", label: "Sources synced" },
  { value: 3200, suffix: "", label: "Signals detected" },
  { value: 847, suffix: "", label: "Broadcasts shipped" },
  { value: 4.2, suffix: "×", label: "Reach lift", decimals: 1 },
];

const FEATURES = [
  {
    icon: Mic,
    title: "Voice consistency",
    body:
      "Trained on every doc your team has ever written. Anchr writes like a human inside your company — not like an AI.",
    accent: "col-span-1 row-span-1 md:col-span-2",
  },
  {
    icon: GitPullRequest,
    title: "Trigger-based publishing",
    body:
      "A PR merges. Two hours later, a polished update is live. Founders never have to think about content again.",
    accent: "col-span-1 row-span-1",
  },
  {
    icon: Telescope,
    title: "Competitive hooks",
    body:
      "Nia tracks your competitors' changelogs and outages. Anchr surfaces the angles you would have missed.",
    accent: "col-span-1 row-span-1",
  },
  {
    icon: Megaphone,
    title: "Ship to every platform",
    body:
      "Same broadcast, ten formats. TikTok 30s. LinkedIn 90s. YouTube 4 min. Email digest. Slack #releases.",
    accent: "col-span-1 row-span-1 md:col-span-2",
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
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#sources" className="transition hover:text-white">
              Sources
            </a>
            <a href="#stack" className="transition hover:text-white">
              Stack
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "hidden h-9 px-4 text-sm text-white/80 hover:bg-white/10 hover:text-white sm:inline-flex",
              )}
            >
              Sign in
            </Link>
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "h-9 rounded-full bg-white px-4 text-sm font-medium text-black hover:bg-white/90",
              )}
            >
              Get started
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate flex flex-1 items-center overflow-hidden">
        {/* Animated code-style grid */}
        <AnimatedGridPattern
          numSquares={60}
          maxOpacity={0.12}
          duration={3}
          repeatDelay={0.6}
          width={44}
          height={44}
          className={cn(
            "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
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
              Anchr turns your team&apos;s data into polished video updates —
              auto-generated, on-brand, ready to ship. No more silent shipping.
            </p>
          </BlurFade>

          <BlurFade delay={0.45} inView>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants(),
                  "h-12 rounded-full bg-white px-7 text-sm font-medium text-black hover:bg-white/90",
                )}
              >
                Start broadcasting
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
              <Button
                variant="ghost"
                size="lg"
                className="h-12 gap-2 rounded-full border border-white/15 bg-white/[0.03] px-7 text-sm font-medium text-white/85 backdrop-blur hover:bg-white/[0.08] hover:text-white"
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

      {/* Stats */}
      <section className="relative border-b border-white/5 py-14">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-y-10 px-6 md:grid-cols-4 md:gap-y-0">
          {STATS.map((s, i) => (
            <BlurFade key={s.label} delay={0.05 * i} inView>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-baseline text-4xl font-semibold tracking-[-0.03em] text-white tabular-nums md:text-5xl">
                  <NumberTicker
                    value={s.value}
                    decimalPlaces={s.decimals ?? 0}
                    className="text-white"
                  />
                  <span className="ml-0.5">{s.suffix}</span>
                </div>
                <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  {s.label}
                </span>
              </div>
            </BlurFade>
          ))}
        </div>
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
            From scattered{" "}
            <span className="font-serif italic font-normal">signals</span> to a
            finished broadcast.
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

      {/* Data flow visualization */}
      <section className="relative isolate overflow-hidden border-y border-white/5 bg-gradient-to-b from-transparent via-white/[0.015] to-transparent py-24">
        {/* faint dot accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 size-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="mx-auto w-full max-w-6xl px-6">
          <BlurFade inView>
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
                Data convergence
              </p>
              <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
                One brain.{" "}
                <span className="font-serif italic font-normal">
                  Every signal
                </span>
                .
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-balance text-white/60">
                Hyperspell ingests. Nia validates. Anchr broadcasts. Every
                message, every PR, every doc — funneled into a single voice.
              </p>
            </div>
          </BlurFade>
          <BlurFade delay={0.2} inView>
            <DataFlow />
          </BlurFade>
        </div>
      </section>

      {/* Bento features */}
      <section
        id="features"
        className="relative mx-auto w-full max-w-6xl px-6 py-28"
      >
        <BlurFade inView>
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
                Why Anchr
              </p>
              <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
                Marketing that{" "}
                <span className="font-serif italic font-normal">writes</span>{" "}
                itself.
              </h2>
            </div>
            <p className="hidden max-w-sm text-sm text-white/60 md:block">
              Built for shipping teams who don&apos;t have a content person — or
              who do, but want them focused on something bigger than weekly
              updates.
            </p>
          </div>
        </BlurFade>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, accent }, i) => (
            <BlurFade key={title} delay={0.07 * i} inView>
              <div
                className={cn(
                  "group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 backdrop-blur transition duration-300 hover:border-white/20 hover:bg-white/[0.04]",
                  accent,
                )}
              >
                <div className="mb-5 grid size-11 place-items-center rounded-xl border border-white/15 bg-white/[0.04]">
                  <Icon className="size-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                  {title}
                </h3>
                <p className="mt-2.5 max-w-md text-sm leading-relaxed text-white/60">
                  {body}
                </p>
                {/* corner accent shape */}
                <div className="pointer-events-none absolute -bottom-10 -right-10 size-40 rounded-full border border-white/[0.04] bg-white/[0.015]" />
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Script preview */}
      <section className="relative isolate overflow-hidden border-y border-white/5 py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 size-[420px] rounded-full bg-white/[0.04] blur-3xl" />
          <div className="absolute -bottom-20 left-0 size-[420px] rounded-full bg-white/[0.04] blur-3xl" />
        </div>
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <BlurFade inView>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
              Inside the studio
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
              Watch a script{" "}
              <span className="font-serif italic font-normal">
                write itself
              </span>
              .
            </h2>
            <p className="mt-5 max-w-md text-white/60 md:text-lg">
              Vercel AI Gateway routes the prompt. Hyperspell hands over the
              week&apos;s context. Nia checks the facts. The result lands in
              your inbox before stand-up.
            </p>
            <div className="mt-7 flex items-center gap-4 text-sm text-white/50">
              <Brain className="size-4 text-white/60" />
              <span>Claude Sonnet 4.6 · routed by AI Gateway</span>
            </div>
          </BlurFade>

          <BlurFade delay={0.15} inView>
            <ScriptPreview />
          </BlurFade>
        </div>
      </section>

      {/* Demo preview */}
      <section className="relative mx-auto w-full max-w-6xl px-6 py-28">
        <BlurFade inView>
          <div className="mb-10 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
              Sample broadcast
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
              Two minutes that took us{" "}
              <span className="font-serif italic font-normal">zero</span>.
            </h2>
          </div>
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
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants(),
                "h-12 rounded-full bg-white px-7 text-sm font-medium text-black hover:bg-white/90",
              )}
            >
              Get on air
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
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
