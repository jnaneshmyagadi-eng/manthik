import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DemoBanner } from "@/components/demo-banner";
import { RerunIntelligence } from "./rerun-intelligence";

export default async function IntelligencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, product_url")
    .eq("id", id)
    .single();
  if (!project) notFound();

  const [{ data: product }, { data: segments }, { data: competitors }] = await Promise.all([
    supabase
      .from("product_intelligence")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("customer_segments").select("*").eq("project_id", id).order("rank"),
    supabase.from("competitors").select("*").eq("project_id", id),
  ]);

  const isDemo = product?.source === "demo" || !product;
  const isFailed = product?.source === "failed";
  const isPage = product?.source === "page" || product?.source === "page+heuristic";
  const raw = (product?.raw_analysis || {}) as Record<string, unknown>;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Intelligence</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Product · Customers · Competitors</p>
          {project.product_url && (
            <p className="mt-1 text-xs text-[var(--muted)] break-all">{project.product_url}</p>
          )}
        </div>
        <RerunIntelligence projectId={id} />
      </div>

      <DemoBanner show={isDemo} />
      {isPage && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
          Live page analysis — signals extracted from the public website (not invented demo copy).
        </div>
      )}
      {isFailed && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
          Page fetch failed. Check the URL is public and reachable, then re-run intelligence.
        </div>
      )}

      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted)]">Product</h2>
        {product ? (
          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4 text-sm">
            <p>{product.summary}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <List title="Strengths" items={(product.strengths as string[]) || []} />
              <List title="Weaknesses" items={(product.weaknesses as string[]) || []} />
            </div>
            <div>
              <h3 className="text-xs text-[var(--muted)] uppercase">Positioning</h3>
              <p className="mt-1">{product.positioning}</p>
            </div>
            <List title="Conversion problems" items={(product.conversion_problems as string[]) || []} />
            {raw.title != null && (
              <div className="rounded-lg border border-[var(--border)] bg-black/20 p-3 text-xs text-[var(--muted)] space-y-1">
                <div>
                  <span className="text-[var(--foreground)]">Title:</span> {String(raw.title)}
                </div>
                {Array.isArray(raw.h1) && raw.h1.length > 0 && (
                  <div>
                    <span className="text-[var(--foreground)]">H1:</span> {(raw.h1 as string[]).join(" · ")}
                  </div>
                )}
                {Array.isArray(raw.ctas) && (raw.ctas as string[]).length > 0 && (
                  <div>
                    <span className="text-[var(--foreground)]">CTAs:</span>{" "}
                    {(raw.ctas as string[]).slice(0, 5).join(", ")}
                  </div>
                )}
                {raw.pricing_public != null && String(raw.pricing_public) && (
                  <div>
                    <span className="text-[var(--foreground)]">Pricing signals:</span>{" "}
                    {String(raw.pricing_public)}
                  </div>
                )}
                {raw.wordCount != null && (
                  <div>
                    <span className="text-[var(--foreground)]">Words:</span> {String(raw.wordCount)}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <Empty />
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted)]">
          Customer segments
        </h2>
        <div className="mt-3 space-y-3">
          {(segments || []).map((s) => (
            <div key={s.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm">
              <div className="flex justify-between gap-2">
                <h3 className="font-medium">{s.name}</h3>
                {s.fit_score != null && (
                  <span className="text-xs text-[var(--muted)] tabular-nums">
                    Fit {(Number(s.fit_score) * 100).toFixed(0)}%
                  </span>
                )}
              </div>
              <p className="mt-1 text-[var(--muted)]">{s.description}</p>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <List title="Pain points" items={(s.pain_points as string[]) || []} />
                <List title="Messaging angles" items={(s.messaging_angles as string[]) || []} />
              </div>
            </div>
          ))}
          {!segments?.length && <Empty />}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted)]">Competitors</h2>
        <div className="mt-3 space-y-3">
          {(competitors || []).map((c) => (
            <div key={c.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm">
              <h3 className="font-medium">{c.name}</h3>
              <p className="mt-1 text-[var(--muted)]">{c.positioning}</p>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <List title="Strengths" items={(c.strengths as string[]) || []} />
                <List
                  title="Differentiation"
                  items={(c.differentiation_opportunities as string[]) || []}
                />
              </div>
            </div>
          ))}
          {!competitors?.length && (
            <div className="rounded-xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
              No competitors extracted from the page. Manthik does not invent competitor lists.
              Mentions of “vs” / “alternative to” on your site are captured when present. A SERP API
              can be added later for discovery.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{title}</h4>
      <ul className="mt-1 list-disc pl-4 space-y-0.5 text-[var(--muted)]">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function Empty() {
  return (
    <div className="mt-3 rounded-xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
      No data yet. Complete onboarding with a product URL to run live analysis.
    </div>
  );
}
