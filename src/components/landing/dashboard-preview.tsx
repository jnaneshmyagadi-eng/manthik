export function DashboardPreview() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/80">Product</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Your AI growth team, working every day.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
            Score, opportunities, and today&apos;s plan in one place. Sample UI below — labelled demo data.
          </p>
        </div>

        <div className="relative mx-auto mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c] shadow-2xl shadow-indigo-500/10">
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="ml-3 text-[10px] text-zinc-600">manthik · Growth Project</span>
            <span className="ml-auto rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] text-amber-200/90">
              Demo UI
            </span>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-12 sm:p-5">
            <div className="sm:col-span-3 glass rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-wide text-zinc-500">Growth score</div>
              <div className="mt-1 text-3xl font-semibold tabular-nums text-white">42</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full w-[42%] rounded-full bg-indigo-500" />
              </div>
            </div>
            <div className="sm:col-span-3 glass rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-wide text-zinc-500">Top opportunity</div>
              <div className="mt-1 text-sm font-medium">Founder-led X</div>
              <div className="mt-1 text-xs text-emerald-400">Score 86 · HIGH</div>
            </div>
            <div className="sm:col-span-6 glass rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-wide text-zinc-500">Today</div>
              <ul className="mt-2 space-y-1.5 text-xs text-zinc-300">
                <li className="flex justify-between gap-2">
                  <span>Write positioning statement</span>
                  <span className="text-zinc-500">25m</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>Post founder insight on X</span>
                  <span className="text-zinc-500">20m</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>Map 5 Reddit communities</span>
                  <span className="text-zinc-500">35m</span>
                </li>
              </ul>
            </div>

            <div className="sm:col-span-4 glass rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-wide text-zinc-500">Customers</div>
              <p className="mt-1 text-xs text-zinc-400">Indie founders · SaaS teams · Agencies</p>
            </div>
            <div className="sm:col-span-4 glass rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-wide text-zinc-500">Competitors</div>
              <p className="mt-1 text-xs text-zinc-400">Generic AI writers · Analytics suites</p>
            </div>
            <div className="sm:col-span-4 glass rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-wide text-zinc-500">Experiments</div>
              <p className="mt-1 text-xs text-zinc-400">Headline A/B · CTA test · Referral loop</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
