const steps = [
  { t: "Your Product", d: "URL, stage, goal" },
  { t: "Product Intelligence", d: "Positioning & gaps" },
  { t: "Customer Intelligence", d: "Segments & language" },
  { t: "Market Intelligence", d: "Channels & demand" },
  { t: "Growth Opportunities", d: "Ranked by impact" },
  { t: "Daily Actions", d: "What to do next" },
  { t: "Customers", d: "Measurable outcomes" },
];

export function GrowthFlow3D() {
  return (
    <section className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/80">System</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">How Manthik thinks</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
          From product signal to daily action — one intelligence loop, not a chatbot chat log.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-lg">
        <ol className="relative space-y-0">
          {steps.map((s, i) => (
            <li key={s.t} className="relative flex gap-4 pb-8 last:pb-0">
              {i < steps.length - 1 && (
                <span className="absolute left-[15px] top-8 h-[calc(100%-8px)] w-px bg-gradient-to-b from-indigo-500/50 to-white/5" />
              )}
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-400/30 bg-zinc-950 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
                <span className="h-2 w-2 rounded-full bg-indigo-400" />
              </div>
              <div className="glass card-hover flex-1 rounded-xl px-4 py-3 text-left">
                <div className="text-sm font-medium">{s.t}</div>
                <div className="mt-0.5 text-xs text-zinc-500">{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
