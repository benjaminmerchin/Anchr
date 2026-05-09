import { cn } from "@/lib/utils";

export function AnchrLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative grid size-8 place-items-center overflow-hidden rounded-lg border border-white/15 bg-gradient-to-b from-white/10 to-white/[0.02]">
        <span className="font-serif text-lg leading-none italic text-white">
          A
        </span>
      </div>
      <span className="text-lg font-semibold tracking-tight text-white">
        Anchr
      </span>
    </div>
  );
}
