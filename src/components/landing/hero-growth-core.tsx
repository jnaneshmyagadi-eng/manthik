/** Lightweight pseudo-3D Growth Intelligence Core — CSS only, mobile-safe */

export function HeroGrowthCore() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[380px] sm:max-w-[440px]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Depth rings */}
      <div className="absolute inset-[8%] rounded-full border border-white/5" />
      <div className="absolute inset-[16%] rounded-full border border-indigo-500/20 animate-pulse-soft" />
      <div className="absolute inset-[24%] rounded-full border border-white/[0.04]" />

      {/* Core */}
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-400 via-indigo-600 to-violet-900 glow-ring animate-pulse-soft">
        <div className="absolute inset-2 rounded-full bg-gradient-to-t from-transparent to-white/25" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/90">AI</span>
        </div>
      </div>

      {/* Orbiting nodes */}
      <Orbit label="Product" style={{ "--orbit-r": "110px", "--orbit-d": "22s" } as React.CSSProperties} />
      <Orbit label="Intel" style={{ "--orbit-r": "130px", "--orbit-d": "28s", animationDelay: "-7s" } as React.CSSProperties} />
      <Orbit label="Opp" style={{ "--orbit-r": "95px", "--orbit-d": "16s", animationDelay: "-3s" } as React.CSSProperties} />
      <Orbit label="Action" style={{ "--orbit-r": "145px", "--orbit-d": "32s", animationDelay: "-12s" } as React.CSSProperties} />

      {/* Floating cards */}
      <FloatingCard className="left-0 top-[18%] animate-float" title="Growth" value="+42" />
      <FloatingCard className="right-0 top-[28%] animate-float-delayed" title="Opp score" value="86" />
      <FloatingCard className="bottom-[12%] left-[12%] animate-float" title="Today" value="3 tasks" />
      <FloatingCard className="bottom-[20%] right-[8%] animate-float-delayed" title="Segment" value="Founders" />

      {/* Mini graph */}
      <svg
        className="absolute bottom-[8%] left-1/2 w-28 -translate-x-1/2 opacity-70"
        viewBox="0 0 100 32"
        fill="none"
        aria-hidden
      >
        <path
          d="M0 28 C20 26 25 18 40 16 C55 14 60 8 75 6 C88 4 95 2 100 1"
          stroke="url(#g)"
          strokeWidth="2"
          className="animate-pulse-soft"
        />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="100" y2="0">
            <stop stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="1" stopColor="#a5b4fc" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Orbit({
  label,
  style,
}: {
  label: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="orbit-node left-1/2 top-1/2 h-0 w-0" style={style}>
      <div className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-400/40 bg-zinc-900/90 px-2 py-0.5 text-[9px] font-medium tracking-wide text-indigo-200 shadow-lg">
        {label}
      </div>
    </div>
  );
}

function FloatingCard({
  className,
  title,
  value,
}: {
  className?: string;
  title: string;
  value: string;
}) {
  return (
    <div
      className={`absolute glass rounded-xl px-2.5 py-1.5 shadow-xl ${className ?? ""}`}
    >
      <div className="text-[9px] uppercase tracking-wider text-zinc-500">{title}</div>
      <div className="text-xs font-semibold text-white tabular-nums">{value}</div>
    </div>
  );
}
