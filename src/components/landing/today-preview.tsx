const tasks = [
  {
    n: 1,
    title: "Fix your hero message",
    impact: "HIGH",
    time: "20 min",
    why: "Clear outcome-led copy lifts conversion on every channel.",
    cta: "Rewrite headline",
  },
  {
    n: 2,
    title: "Target this customer segment",
    impact: "HIGH",
    time: "30 min",
    why: "Indie founders show the strongest language fit in intelligence.",
    cta: "Open segment",
  },
  {
    n: 3,
    title: "Publish this content",
    impact: "MEDIUM",
    time: "15 min",
    why: "A short X insight tests messaging before you scale.",
    cta: "View draft",
  },
];

export function TodayPreview() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/80">Daily Growth Agent</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Know exactly what to do next.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-400">
            Open Manthik and get a prioritised plan — not another endless feed of ideas.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {tasks.map((t) => (
            <article
              key={t.n}
              className="card-hover glass rounded-2xl p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-zinc-500 tabular-nums">{t.n}.</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        t.impact === "HIGH"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {t.impact}
                    </span>
                    <span className="text-[10px] text-zinc-500">{t.time}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-medium sm:text-base">{t.title}</h3>
                  <p className="mt-1 text-xs text-zinc-400 sm:text-sm">{t.why}</p>
                </div>
                <span className="shrink-0 rounded-lg border border-white/10 px-2.5 py-1 text-[10px] text-zinc-300">
                  {t.cta}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
