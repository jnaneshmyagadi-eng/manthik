import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--border)] px-4 sm:px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="font-semibold tracking-tight text-lg">Manthik</div>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/login" className="text-[var(--muted)] hover:text-[var(--foreground)]">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-[var(--accent)] px-3.5 py-2 text-[var(--accent-fg)] font-medium"
          >
            Start Growing
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 pt-20 pb-16 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
          AI Growth Operating System
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
          Turn your product into customers.
        </h1>
        <p className="mt-6 text-lg text-[var(--muted)] leading-relaxed">
          Manthik finds your best opportunities, builds your growth strategy, and tells you exactly
          what to do next — every day.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-fg)]"
          >
            Start Growing
          </Link>
          <a
            href="#how"
            className="rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-medium"
          >
            See How It Works
          </a>
        </div>
      </section>

      <section id="how" className="border-t border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 grid gap-10 sm:grid-cols-3">
          {[
            {
              t: "Growth Intelligence",
              d: "Product, customer, and competitor analysis so you know who to win and why.",
            },
            {
              t: "Opportunity Engine",
              d: "Ranked opportunities across channels by fit, effort, speed, and impact.",
            },
            {
              t: "Daily Growth Agent",
              d: "Open Manthik and know the exact 3–4 actions that move the needle today.",
            },
          ].map((item) => (
            <div key={item.t}>
              <h3 className="font-medium">{item.t}</h3>
              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Not another chatbot.</h2>
        <p className="mt-4 text-[var(--muted)]">
          Manthik behaves like a smart growth team sitting beside the founder — prioritised, actionable,
          and measurable.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-fg)]"
        >
          Create your first Growth Project
        </Link>
      </section>

      <footer className="border-t border-[var(--border)] py-8 text-center text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} Manthik · AI Growth Operating System
      </footer>
    </main>
  );
}
