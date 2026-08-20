import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DemoBanner } from "@/components/demo-banner";
import { PriorityBadge } from "@/components/priority-badge";

export default async function OpportunitiesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase.from("projects").select("id").eq("id", id).single();
  if (!project) notFound();

  const { data: opps } = await supabase
    .from("opportunities")
    .select("*")
    .eq("project_id", id)
    .order("opportunity_score", { ascending: false });

  const isDemo = opps?.[0]?.source === "demo" || !opps?.length;

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Opportunities</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">Ranked by fit, demand, effort, speed, and impact.</p>
      <DemoBanner show={isDemo} />

      <div className="mt-6 space-y-3">
        {(opps || []).map((o) => (
          <article key={o.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <PriorityBadge priority={o.priority} />
                  <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{o.channel}</span>
                </div>
                <h2 className="mt-2 font-medium">{o.title}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{o.description}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xl font-semibold tabular-nums">{o.opportunity_score}</div>
                <div className="text-[10px] text-[var(--muted)]">Score</div>
              </div>
            </div>
            {Array.isArray(o.recommended_actions) && o.recommended_actions.length > 0 && (
              <ul className="mt-3 list-disc pl-4 text-sm text-[var(--muted)] space-y-0.5">
                {(o.recommended_actions as string[]).map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
        {!opps?.length && (
          <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
            No opportunities yet.
          </div>
        )}
      </div>
    </div>
  );
}
