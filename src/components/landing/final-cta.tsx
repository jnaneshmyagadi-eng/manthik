import Link from "next/link";

export function FinalCta() {
  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-indigo-500/10 to-transparent px-6 py-14 text-center">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <h2 className="relative text-2xl font-semibold tracking-tight sm:text-3xl">
          Turn your product into customers.
        </h2>
        <p className="relative mx-auto mt-4 max-w-md text-sm text-zinc-400">
          An AI growth team beside you — intelligence, opportunities, and what to do next.
        </p>
        <Link
          href="/signup"
          className="btn-primary relative mt-8 inline-flex rounded-xl px-8 py-3.5 text-sm font-medium"
        >
          Start Growing
        </Link>
        <p className="relative mt-4 text-xs text-zinc-600">Free to start · No credit card required</p>
      </div>
    </section>
  );
}
