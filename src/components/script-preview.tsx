import { Radio } from "lucide-react";

const LINES: Array<{
  prefix: string;
  text: React.ReactNode;
  prefixColor: string;
}> = [
  {
    prefix: "01",
    prefixColor: "text-white/30",
    text: (
      <>
        <span className="text-white/40">// </span>
        <span className="text-white/60">cold open · 0:00 → 0:08</span>
      </>
    ),
  },
  {
    prefix: "02",
    prefixColor: "text-white/30",
    text: (
      <>
        <span className="text-emerald-300/90">Anchor:</span>{" "}
        <span className="text-white/85">
          &quot;Big week at Anchr — we just shipped real-time
        </span>
      </>
    ),
  },
  {
    prefix: "03",
    prefixColor: "text-white/30",
    text: (
      <>
        <span className="text-white/85">
          collaboration, hit{" "}
        </span>
        <span className="text-amber-300/90">1,000 users</span>
        <span className="text-white/85">
          {" "}and locked in our seed round.&quot;
        </span>
      </>
    ),
  },
  {
    prefix: "04",
    prefixColor: "text-white/30",
    text: (
      <>
        <span className="text-white/40">// </span>
        <span className="text-white/60">b-roll · PR #842 by @sasha</span>
      </>
    ),
  },
  {
    prefix: "05",
    prefixColor: "text-white/30",
    text: (
      <>
        <span className="text-emerald-300/90">Anchor:</span>{" "}
        <span className="text-white/85">
          &quot;Big thanks to the team — and to{" "}
        </span>
      </>
    ),
  },
  {
    prefix: "06",
    prefixColor: "text-white/30",
    text: (
      <>
        <span className="text-white/85">every customer who told us what was </span>
        <span className="text-sky-300/90">broken</span>
        <span className="text-white/85">.&quot;</span>
      </>
    ),
  },
  {
    prefix: "07",
    prefixColor: "text-white/30",
    text: (
      <>
        <span className="text-white/40">// </span>
        <span className="text-white/60">CTA · 0:52 → 1:04 · sign-off</span>
      </>
    ),
  },
];

export function ScriptPreview() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur">
      {/* window chrome */}
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
          <Radio className="size-3" />
          broadcast-002 · weekly.script
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-emerald-300">
          <span className="size-1 animate-pulse rounded-full bg-emerald-400" />
          ready
        </div>
      </div>
      {/* code body */}
      <div className="px-5 py-5 font-mono text-[13px] leading-relaxed">
        {LINES.map((l) => (
          <div key={l.prefix} className="flex gap-4">
            <span className={`select-none ${l.prefixColor} tabular-nums`}>
              {l.prefix}
            </span>
            <span className="text-balance">{l.text}</span>
          </div>
        ))}
        <div className="mt-2 flex items-center gap-2 text-white/30">
          <span className="select-none tabular-nums">08</span>
          <span className="inline-block h-3.5 w-1.5 animate-pulse bg-white/60" />
        </div>
      </div>
    </div>
  );
}
