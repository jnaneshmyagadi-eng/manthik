import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ExperimentForm } from "./experiment-form";
import { ExperimentControls } from "./experiment-controls";

export default async function ExperimentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase.from("projects").select("id").eq("id", id).single();
  if (!project) notFound();

  const { data: experiments } = await supabase
    .from("growth_experiments")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Experiments</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Track hypotheses. Winners only with real results — never fabricated.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <ExperimentForm projectId={id} />
      </div>

      {(experiments || []).length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
          No experiments yet. Log a hypothesis above.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {experiments!.map((e) => (
            <li key={e.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
              <div className="flex justify-between gap-2 items-start">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{e.status}</span>
                    {e.channel && (
                      <span className="text-[10px] text-[var(--muted)]">{e.channel}</span>
                    )}
                    {e.result && (
                      <span className="text-[10px] font-medium uppercase text-emerald-400">{e.result}</span>
                    )}
                  </div>
                  <h2 className="mt-1 font-medium">{e.name}</h2>
                  <p className="mt-1 text-[var(--muted)]">{e.hypothesis}</p>
                  {e.metric && (
                    <p className="mt-1 text-xs text-[var(--muted)]">Metric: {e.metric}</p>
                  )}
                </div>
                <ExperimentControls
                  projectId={id}
                  expId={e.id}
                  status={e.status}
                  result={e.result}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
