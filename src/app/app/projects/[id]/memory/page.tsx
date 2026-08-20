import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function MemoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, memory")
    .eq("id", id)
    .single();
  if (!project) notFound();

  const memory = (project.memory as Record<string, unknown>) || {};
  const experiments = (Array.isArray(memory.experiments) ? memory.experiments : []) as {
    name: string;
    result?: string;
    status?: string;
    channel?: string;
    at?: string;
  }[];
  const conversion = memory.conversion as { conversion_score?: number; summary?: string } | undefined;

  const { data: insights } = await supabase
    .from("ai_insights")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Growth Memory</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Wins, losses, and insights that improve future recommendations.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted)]">Experiments log</h2>
        {experiments.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">No completed experiments stored yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {experiments.map((e, i) => (
              <li key={i} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm flex justify-between gap-2">
                <span>
                  {e.name}
                  {e.channel ? ` · ${e.channel}` : ""}
                </span>
                <span className="text-[var(--muted)] capitalize">{e.result || e.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {conversion && (
        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted)]">Last conversion snapshot</h2>
          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
            <div className="font-semibold tabular-nums">Score {conversion.conversion_score}</div>
            <p className="mt-1 text-[var(--muted)]">{conversion.summary}</p>
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted)]">Insights</h2>
        {(insights || []).length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">No insights yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {insights!.map((ins) => (
              <li key={ins.id} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                <div className="font-medium">{ins.title}</div>
                <p className="text-[var(--muted)]">{ins.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
