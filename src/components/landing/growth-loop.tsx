const loop = ["Discover", "Understand", "Strategize", "Create", "Execute", "Measure", "Learn"];

export function GrowthLoop() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/80">Growth Memory</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          Manthik gets smarter as your business grows.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-400">
          Wins, losses, and insights feed the next plan — so recommendations improve over time.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {loop.map((step, i) => (
            <div key={step} className="flex items-center gap-2 sm:gap-3">
              <div className="glass rounded-xl px-3 py-2 text-xs font-medium sm:text-sm">{step}</div>
              {i < loop.length - 1 && (
                <span className="text-zinc-600" aria-hidden>
                  →
                </span>
              )}
            </div>
          ))}
          <span className="ml-1 text-indigo-400" aria-hidden>
            ↺
          </span>
        </div>
      </div>
    </section>
  );
}
