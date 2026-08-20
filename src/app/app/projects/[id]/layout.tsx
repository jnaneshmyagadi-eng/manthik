import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppNav } from "@/components/app-nav";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, main_goal, growth_score")
    .eq("id", id)
    .single();

  if (!project) notFound();

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border)] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/app" className="font-semibold tracking-tight shrink-0">
            Manthik
          </Link>
          <span className="text-[var(--muted)] hidden sm:inline">/</span>
          <span className="truncate text-sm text-[var(--muted)]">{project.name}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold tabular-nums">{project.growth_score ?? "—"}</div>
            <div className="text-[10px] text-[var(--muted)]">Score</div>
          </div>
          <form action="/api/auth/signout" method="post">
            <Link href="/app" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)]">
              Projects
            </Link>
          </form>
        </div>
      </header>
      <div className="px-4 sm:px-6 py-4 max-w-5xl mx-auto">
        <AppNav projectId={id} />
        {children}
      </div>
    </div>
  );
}
