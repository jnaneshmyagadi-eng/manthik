import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DemoBanner } from "@/components/demo-banner";

export default async function ContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase.from("projects").select("id, name").eq("id", id).single();
  if (!project) notFound();

  const { data: items } = await supabase
    .from("content_items")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Content</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Platform-specific drafts linked to opportunities. Live generation requires AI key.
      </p>
      <DemoBanner show />

      {(items || []).length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
          <p>No content drafts yet.</p>
          <p className="mt-2">
            Complete Today tasks and open Opportunities. Content engine will generate platform-native
            drafts when AI is connected, or you can add drafts manually later.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {items!.map((c) => (
            <li key={c.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-[10px] uppercase text-[var(--muted)]">{c.platform}</span>
                <span className="text-[10px] uppercase text-[var(--muted)]">{c.status}</span>
              </div>
              <h2 className="mt-1 font-medium">{c.title || "Untitled"}</h2>
              <p className="mt-2 text-[var(--muted)] whitespace-pre-wrap">{c.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
