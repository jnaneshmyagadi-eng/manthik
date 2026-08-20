import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DemoBanner } from "@/components/demo-banner";

export default async function IntelligencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase.from("projects").select("id, name").eq("id", id).single();
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

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Intelligence</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Product · Customers · Competitors</p>
      </div>
      <DemoBanner show={isDemo} />

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
          {!competitors?.length && <Empty />}
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
      No data yet. Complete onboarding to generate intelligence.
    </div>
  );
}
