import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DemoBanner } from "@/components/demo-banner";

export default async function OverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!project) notFound();

  const [{ count: oppCount }, { count: taskDone }, { count: taskTotal }, { data: run }] =
    await Promise.all([
      supabase.from("opportunities").select("*", { count: "exact", head: true }).eq("project_id", id),
      supabase
        .from("growth_tasks")
        .select("*", { count: "exact", head: true })
        .eq("project_id", id)
        .eq("status", "done"),
      supabase.from("growth_tasks").select("*", { count: "exact", head: true }).eq("project_id", id),
      supabase
        .from("ai_runs")
        .select("is_demo")
        .eq("project_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">{project.description || "No description"}</p>
      <DemoBanner show={run?.data?.is_demo !== false} />

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Growth score", value: project.growth_score ?? "—" },
          { label: "Goal", value: project.main_goal ? "Set" : "—" },
          { label: "Opportunities", value: oppCount ?? 0 },
          { label: "Tasks done", value: `${taskDone ?? 0}/${taskTotal ?? 0}` },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{m.label}</div>
            <div className="mt-1 text-lg font-semibold tabular-nums truncate">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm space-y-2">
        <div>
          <span className="text-[var(--muted)]">Stage:</span> {project.current_stage}
        </div>
        <div>
          <span className="text-[var(--muted)]">Users:</span> {project.current_users ?? 0}
        </div>
        <div>
          <span className="text-[var(--muted)]">Market:</span> {project.target_market || "—"}
        </div>
        <div>
          <span className="text-[var(--muted)]">URL:</span>{" "}
          {project.product_url ? (
            <a href={project.product_url} className="text-[var(--accent)]" target="_blank" rel="noreferrer">
              {project.product_url}
            </a>
          ) : (
            "—"
          )}
        </div>
      </div>
    </div>
  );
}
