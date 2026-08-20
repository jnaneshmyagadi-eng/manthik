export function CompetitorMap() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/80">Competitor Intelligence</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Find the gap, not the clone</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-400">
          Positioning map — demo illustration of where Manthik sits vs content tools and pure analytics.
        </p>

        <div className="relative mx-auto mt-12 h-64 max-w-md sm:h-72">
          <div className="absolute inset-0 rounded-2xl border border-white/5 bg-white/[0.02]" />
          {/* Axes */}
          <div className="absolute bottom-8 left-8 right-8 top-8">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
            <div className="absolute bottom-0 left-0 top-0 w-px bg-white/10" />
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-zinc-600">Actionable →</span>
            <span className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-zinc-600">Intelligence →</span>

            <div className="absolute bottom-[15%] left-[20%] rounded-lg border border-white/10 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-400">
              AI writers
            </div>
            <div className="absolute bottom-[55%] left-[25%] rounded-lg border border-white/10 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-400">
              Analytics
            </div>
            <div className="absolute bottom-[70%] left-[65%] rounded-lg border border-indigo-400/40 bg-indigo-500/20 px-2.5 py-1.5 text-[10px] font-medium text-indigo-100 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
              Manthik
            </div>
            <div className="absolute bottom-[40%] left-[50%] rounded-lg border border-dashed border-emerald-500/30 px-2 py-1 text-[9px] text-emerald-400/90">
              Gap: daily action
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
