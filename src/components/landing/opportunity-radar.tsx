const opps = [
  { name: "X", score: 86, demand: 75, competition: 55, effort: 30, impact: 80, top: true },
  { name: "Reddit", score: 78, demand: 70, competition: 40, effort: 45, impact: 75, top: false },
  { name: "SEO", score: 72, demand: 80, competition: 65, effort: 60, impact: 85, top: false },
  { name: "YouTube", score: 54, demand: 60, competition: 70, effort: 75, impact: 70, top: false },
  { name: "LinkedIn", score: 61, demand: 55, competition: 50, effort: 40, impact: 65, top: false },
  { name: "Partners", score: 58, demand: 45, competition: 35, effort: 55, impact: 70, top: false },
];

export function OpportunityRadar() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/80">Opportunity Engine</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Opportunity radar</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
            Channels ranked by fit, demand, effort, and impact — demo scores for illustration.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          {/* Radar visual */}
          <div className="relative mx-auto aspect-square w-full max-w-[300px]">
            <div className="absolute inset-0 rounded-full border border-white/5" />
            <div className="absolute inset-[15%] rounded-full border border-indigo-500/15" />
            <div className="absolute inset-[30%] rounded-full border border-indigo-500/25" />
            <div className="absolute inset-[45%] rounded-full border border-indigo-400/30 animate-pulse-soft" />
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400 shadow-[0_0_20px_#818cf8]" />
            {/* Blips */}
            <span className="absolute left-[62%] top-[28%] h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" title="X" />
            <span className="absolute left-[72%] top-[48%] h-1.5 w-1.5 rounded-full bg-indigo-300" />
            <span className="absolute left-[35%] top-[30%] h-1.5 w-1.5 rounded-full bg-zinc-400" />
            <span className="absolute left-[25%] top-[55%] h-2 w-2 rounded-full bg-indigo-400/80" />
            <span className="absolute left-[55%] top-[70%] h-1.5 w-1.5 rounded-full bg-zinc-500" />
            <span className="absolute left-[40%] top-[18%] h-1.5 w-1.5 rounded-full bg-zinc-500" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-zinc-500">Product at center</div>
          </div>

          <ul className="space-y-2">
            {opps.map((o) => (
              <li
                key={o.name}
                className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-sm ${
                  o.top
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-white/5 bg-white/[0.02]"
                }`}
              >
                <span className="font-medium">{o.name}</span>
                <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                  <span className="hidden sm:inline">D {o.demand}</span>
                  <span className="hidden sm:inline">C {o.competition}</span>
                  <span className="hidden sm:inline">E {o.effort}</span>
                  <span className="tabular-nums text-sm font-semibold text-white">{o.score}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
