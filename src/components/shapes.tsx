export function FloatingShapes() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* large soft white blob top-left */}
      <div className="absolute -top-32 -left-32 size-[28rem] rounded-full bg-white/[0.04] blur-3xl" />
      {/* mid-right ring */}
      <div className="absolute top-1/3 -right-24 size-[22rem] rounded-full border border-white/10 bg-white/[0.01] backdrop-blur-3xl" />
      {/* small accent square, rotated */}
      <div className="absolute top-24 right-[20%] size-24 rotate-45 rounded-2xl border border-white/15 bg-white/[0.04]" />
      {/* small dot */}
      <div className="absolute top-[58%] left-[12%] size-3 rounded-full bg-white" />
      {/* outline circle */}
      <div className="absolute bottom-12 right-[18%] size-40 rounded-full border border-white/15" />
      {/* tiny diamond bottom-left */}
      <div className="absolute bottom-24 left-[24%] size-16 rotate-12 rounded-md border border-white/20 bg-white/[0.03]" />
    </div>
  );
}
