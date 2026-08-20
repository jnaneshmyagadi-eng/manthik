import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DemoBanner } from "@/components/demo-banner";
import { PriorityBadge } from "@/components/priority-badge";
import { TaskActions } from "./task-actions";

export default async function TodayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!project) notFound();

  const today = new Date().toISOString().slice(0, 10);
  const { data: plan } = await supabase
    .from("daily_plans")
    .select("*")
    .eq("project_id", id)
    .eq("plan_date", today)
    .maybeSingle();

  const { data: tasks } = await supabase
    .from("growth_tasks")
    .select("*")
    .eq("project_id", id)
    .order("sort_order", { ascending: true });

  const { data: topOpps } = await supabase
    .from("opportunities")
    .select("id, title, priority, channel, opportunity_score")
    .eq("project_id", id)
    .eq("status", "open")
    .order("opportunity_score", { ascending: false })
    .limit(3);

  const { data: lastRun } = await supabase
    .from("ai_runs")
    .select("is_demo")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const isDemo = lastRun?.is_demo !== false;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Today&apos;s Growth Plan</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {plan?.summary || `What to do next for ${project.name}`}
        </p>
        {project.main_goal && (
          <p className="mt-2 text-xs text-[var(--muted)]">
            Goal: <span className="text-[var(--foreground)]">{project.main_goal}</span>
          </p>
        )}
      </div>

      <DemoBanner show={isDemo} />

      <section className="space-y-3">
        {(tasks || []).length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
            No tasks yet. Create a project from onboarding to generate today&apos;s plan.
          </div>
        )}
        {(tasks || []).map((task, i) => (
          <article
            key={task.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-[var(--muted)] tabular-nums">{i + 1}.</span>
                  <PriorityBadge priority={task.impact || "MEDIUM"} />
                  {task.channel && (
                    <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                      {task.channel}
                    </span>
                  )}
                </div>
                <h2 className="mt-2 font-medium leading-snug">{task.title}</h2>
              </div>
              <TaskActions projectId={id} taskId={task.id} status={task.status} />
            </div>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Why</dt>
                <dd className="text-[var(--muted)]">{task.why}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Expected outcome</dt>
                <dd className="text-[var(--muted)]">{task.expected_outcome}</dd>
              </div>
            </dl>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
              <span>{task.estimated_minutes ?? "—"} min</span>
              <span className="capitalize">{task.difficulty || "medium"}</span>
              {task.cta && <span className="text-[var(--foreground)]">CTA: {task.cta}</span>}
            </div>
          </article>
        ))}
      </section>

      {topOpps && topOpps.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wide">
            Top opportunities
          </h2>
          <ul className="mt-3 space-y-2">
            {topOpps.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm"
              >
                <span className="truncate">{o.title}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <PriorityBadge priority={o.priority} />
                  <span className="tabular-nums text-[var(--muted)]">{o.opportunity_score}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
