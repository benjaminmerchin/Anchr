"use client";

import { forwardRef, useRef } from "react";
import { GitBranch, Mail, MessageSquare, FileText, Database, Calendar } from "lucide-react";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";

const Node = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-10 grid size-12 place-items-center rounded-2xl border border-white/15 bg-black/80 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur",
      className,
    )}
  >
    {children}
  </div>
));
Node.displayName = "Node";

export function DataFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slackRef = useRef<HTMLDivElement>(null);
  const gmailRef = useRef<HTMLDivElement>(null);
  const githubRef = useRef<HTMLDivElement>(null);
  const notionRef = useRef<HTMLDivElement>(null);
  const driveRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const outRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex h-[420px] w-full max-w-3xl items-center justify-between px-6"
    >
      {/* Left column — sources */}
      <div className="flex flex-col items-center gap-6">
        <Node ref={slackRef}>
          <MessageSquare className="size-5 text-white/80" />
        </Node>
        <Node ref={gmailRef}>
          <Mail className="size-5 text-white/80" />
        </Node>
        <Node ref={githubRef}>
          <GitBranch className="size-5 text-white/80" />
        </Node>
        <Node ref={notionRef}>
          <FileText className="size-5 text-white/80" />
        </Node>
        <Node ref={driveRef}>
          <Database className="size-5 text-white/80" />
        </Node>
        <Node ref={calRef}>
          <Calendar className="size-5 text-white/80" />
        </Node>
      </div>

      {/* Center — Anchr brain */}
      <div className="relative flex flex-col items-center">
        <span className="absolute -top-9 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Anchr brain
        </span>
        <Node
          ref={hubRef}
          className="size-20 rounded-3xl border-white/25 bg-gradient-to-b from-white/10 to-white/[0.02]"
        >
          <span className="font-serif text-2xl italic text-white">A</span>
        </Node>
        <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Hyperspell · Nia
        </span>
      </div>

      {/* Right — broadcast output */}
      <div className="flex flex-col items-center">
        <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Broadcast
        </span>
        <Node
          ref={outRef}
          className="size-16 rounded-2xl border-red-500/40 bg-red-500/10"
        >
          <span className="size-2 animate-pulse rounded-full bg-red-400" />
        </Node>
        <span className="mt-3 font-mono text-[10px] uppercase tracking-widest text-white/30">
          ON AIR
        </span>
      </div>

      {/* Beams: sources -> hub */}
      {[slackRef, gmailRef, githubRef, notionRef, driveRef, calRef].map(
        (r, i) => (
          <AnimatedBeam
            key={i}
            containerRef={containerRef}
            fromRef={r}
            toRef={hubRef}
            curvature={i % 2 === 0 ? -25 : 25}
            duration={4 + i * 0.4}
            delay={i * 0.5}
            pathColor="#ffffff"
            pathOpacity={0.08}
            gradientStartColor="#ffffff"
            gradientStopColor="#ffffff66"
          />
        ),
      )}

      {/* Beam: hub -> output */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={outRef}
        duration={3}
        pathColor="#ffffff"
        pathOpacity={0.1}
        gradientStartColor="#ffffff"
        gradientStopColor="#ef4444"
      />
    </div>
  );
}
