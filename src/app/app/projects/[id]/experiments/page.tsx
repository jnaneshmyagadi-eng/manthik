import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
      <h1 className="text-xl font-semibold tracking-tight">Experiments</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Track hypotheses. Winners only with real results — never fabricated.
      </p>

      {(experiments || []).length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
          No experiments yet. Mark conversion or channel tests from Today tasks as you run them.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {experiments!.map((e) => (
            <li key={e.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
              <div className="flex justify-between">
                <h2 className="font-medium">{e.name}</h2>
                <span className="text-xs text-[var(--muted)] capitalize">{e.status}</span>
              </div>
              <p className="mt-1 text-[var(--muted)]">{e.hypothesis}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
