import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DemoBanner } from "@/components/demo-banner";

export default async function StrategyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase.from("projects").select("id").eq("id", id).single();
  if (!project) notFound();

  const { data: strategy } = await supabase
    .from("growth_strategies")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const weeks = (strategy?.weekly_plan as { week: number; focus: string; actions: string[] }[]) || [];

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Strategy</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">{strategy?.goal || "Personalized growth plan"}</p>
      <DemoBanner show={strategy?.source === "demo" || !strategy} />

      {strategy ? (
        <>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {(strategy.key_channels as string[])?.map((c) => (
              <span key={c} className="rounded-full border border-[var(--border)] px-2.5 py-1">
                {c}
              </span>
            ))}
          </div>
          <div className="mt-8 space-y-4">
            {weeks.map((w) => (
              <div key={w.week} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                <h2 className="font-medium">
                  Week {w.week}: {w.focus}
                </h2>
                <ul className="mt-2 list-disc pl-4 text-sm text-[var(--muted)] space-y-1">
                  {w.actions.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
          No strategy yet. Complete project onboarding.
        </div>
      )}
    </div>
  );
}
