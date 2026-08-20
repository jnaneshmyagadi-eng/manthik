import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050507]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 ring-1 ring-indigo-400/30">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_12px_#818cf8]" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Manthik</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3 text-sm">
          <Link
            href="/login"
            className="hidden text-zinc-400 transition hover:text-white sm:inline px-2 py-1.5"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="btn-primary rounded-lg px-3.5 py-2 text-sm font-medium"
          >
            Start Growing
          </Link>
        </nav>
      </div>
    </header>
  );
}
