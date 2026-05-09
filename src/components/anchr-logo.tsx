import { cn } from "@/lib/utils";

export function AnchrLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative grid size-8 place-items-center rounded-lg border border-white/20 bg-white/[0.04] shadow-[inset_0_-6px_12px_rgba(255,255,255,0.04)]">
        {/* concentric "broadcast" rings */}
        <span className="absolute inset-1.5 rounded-full border border-white/15" />
        <span className="absolute inset-2.5 rounded-full border border-white/25" />
        <span className="size-1.5 rounded-full bg-white" />
      </div>
      <span className="text-lg font-semibold tracking-tight text-white">
        Anchr
      </span>
    </div>
  );
}
