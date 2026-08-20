import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/config";

export default async function AppHome() {
  if (!getSupabaseEnv()) {
    redirect("/login?error=config");
  }

  let user = null;
  try {
    const supabase = await createClient();
    const res = await supabase.auth.getUser();
    user = res.data.user;
  } catch {
    redirect("/login?error=auth");
  }

  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, main_goal, growth_score, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!projects?.length) {
    redirect("/onboarding");
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--muted)]">Manthik</p>
          <h1 className="text-2xl font-semibold tracking-tight">Your Growth Projects</h1>
        </div>
        <Link
          href="/onboarding"
          className="rounded-lg bg-[var(--accent)] px-3.5 py-2 text-sm font-medium text-[var(--accent-fg)]"
        >
          New project
        </Link>
      </div>

      <ul className="mt-8 space-y-3">
        {projects.map((p) => (
          <li key={p.id}>
            <Link
              href={`/app/projects/${p.id}/today`}
              className="block rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--accent)]/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium">{p.name}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{p.main_goal || "No goal set"}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-semibold tabular-nums">{p.growth_score ?? "—"}</div>
                  <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Growth score</div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
