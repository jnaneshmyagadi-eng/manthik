const segments = [
  { name: "Startup founders", pain: "No time for marketing", need: "Daily clarity", trigger: "Missed targets" },
  { name: "Creators", pain: "Audience ≠ customers", need: "Offer clarity", trigger: "Launch week" },
  { name: "SaaS teams", pain: "Scattered tools", need: "One growth system", trigger: "New hire" },
  { name: "Agencies", pain: "Custom research is slow", need: "Repeatable playbooks", trigger: "Client onboard" },
];

export function CustomerSegments() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/80">Customer Intelligence</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Who to win — and why</h2>
        </div>

        <div className="relative mx-auto mt-12 max-w-2xl">
          <div className="absolute left-1/2 top-1/2 hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-xl sm:block" />
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/30 bg-zinc-950 text-xs font-semibold text-indigo-200 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            Product
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {segments.map((s) => (
              <div key={s.name} className="card-hover glass rounded-xl p-4 text-left text-sm">
                <h3 className="font-medium">{s.name}</h3>
                <dl className="mt-2 space-y-1 text-xs text-zinc-400">
                  <div>
                    <span className="text-zinc-600">Pain · </span>
                    {s.pain}
                  </div>
                  <div>
                    <span className="text-zinc-600">Need · </span>
                    {s.need}
                  </div>
                  <div>
                    <span className="text-zinc-600">Trigger · </span>
                    {s.trigger}
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
