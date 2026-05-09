import { cn } from "@/lib/utils";

export function SourcePill({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 backdrop-blur",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-white/60" />
      {name}
    </div>
  );
}
