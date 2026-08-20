import Link from "next/link";
import { SiteHeader } from "@/components/landing/site-header";
import { HeroGrowthCore } from "@/components/landing/hero-growth-core";
import { GrowthFlow3D } from "@/components/landing/growth-flow-3d";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { TodayPreview } from "@/components/landing/today-preview";
import { OpportunityRadar } from "@/components/landing/opportunity-radar";
import { CustomerSegments } from "@/components/landing/customer-segments";
import { CompetitorMap } from "@/components/landing/competitor-map";
import { GrowthLoop } from "@/components/landing/growth-loop";
import { FinalCta } from "@/components/landing/final-cta";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050507] text-zinc-100">
      <SiteHeader />

      {/* Hero */}
      <section className="manthik-grid relative border-b border-white/5">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-2 lg:gap-12">
          <div className="text-center lg:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-indigo-300/90">
              AI Growth Operating System
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight leading-[1.1] sm:text-5xl lg:text-[3.25rem]">
              Turn your product into customers.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-zinc-400 lg:mx-0">
              Manthik finds your best opportunities, builds your growth strategy, and tells you exactly what to do
              next — every day.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/signup" className="btn-primary w-full rounded-xl px-6 py-3.5 text-center text-sm font-medium sm:w-auto">
                Start Growing
              </Link>
              <a
                href="#how"
                className="w-full rounded-xl border border-white/10 px-6 py-3.5 text-center text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:text-white sm:w-auto"
              >
                See how it works
              </a>
            </div>
            <p className="mt-6 text-xs text-zinc-600">
              Not another chatbot — an AI growth team beside the founder.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroGrowthCore />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-white/5 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-[11px] uppercase tracking-wider text-zinc-600">
          <span>Product intelligence</span>
          <span className="hidden text-zinc-800 sm:inline">·</span>
          <span>Ranked opportunities</span>
          <span className="hidden text-zinc-800 sm:inline">·</span>
          <span>Daily actions</span>
          <span className="hidden text-zinc-800 sm:inline">·</span>
          <span>Growth memory</span>
        </div>
      </section>

      <div id="how">
        <GrowthFlow3D />
      </div>

      <DashboardPreview />
      <TodayPreview />
      <OpportunityRadar />
      <CustomerSegments />
      <CompetitorMap />
      <GrowthLoop />

      {/* Short product pillars */}
      <section className="border-t border-white/5 px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {[
            {
              t: "Product Intelligence",
              d: "Understand positioning, strengths, and conversion friction before you spend on channels.",
            },
            {
              t: "Content & Conversion",
              d: "Drafts tied to opportunities, plus conversion score and CTA recommendations.",
            },
            {
              t: "Growth Memory",
              d: "Experiments and insights compound — so the next plan is smarter than the last.",
            },
          ].map((x) => (
            <div key={x.t} className="card-hover glass rounded-2xl p-5">
              <h3 className="text-sm font-medium">{x.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <FinalCta />

      <footer className="border-t border-white/5 py-10 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} Manthik · AI Growth Operating System
      </footer>
    </main>
  );
}
