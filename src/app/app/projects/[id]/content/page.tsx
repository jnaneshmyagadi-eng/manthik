import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DemoBanner } from "@/components/demo-banner";
import { ContentActions } from "./content-actions";

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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Content</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Platform drafts tied to growth opportunities. Demo mode until AI is connected.
          </p>
        </div>
        <ContentActions projectId={id} />
      </div>
      <DemoBanner show />

      {(items || []).length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
          <p>No drafts yet.</p>
          <p className="mt-2">Generate platform-native drafts for X, LinkedIn, Reddit, and Blog.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {items!.map((c) => (
            <li key={c.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
              <div className="flex justify-between gap-2 items-start">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{c.platform}</span>
                  <span className="text-[10px] uppercase tracking-wide rounded-full border border-[var(--border)] px-2 py-0.5">
                    {c.status}
                  </span>
                  {c.source === "demo" && (
                    <span className="text-[10px] text-amber-400/90">demo</span>
                  )}
                </div>
                <ContentItemControls projectId={id} itemId={c.id} status={c.status} />
              </div>
              <h2 className="mt-2 font-medium">{c.title || "Untitled"}</h2>
              {c.hook && <p className="mt-1 text-[var(--muted)] italic">{c.hook}</p>}
              <p className="mt-2 text-[var(--muted)] whitespace-pre-wrap">{c.body}</p>
              {c.cta && (
                <p className="mt-2 text-xs">
                  <span className="text-[var(--muted)]">CTA:</span> {c.cta}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ContentItemControls({
  projectId,
  itemId,
  status,
}: {
  projectId: string;
  itemId: string;
  status: string;
}) {
  return <ContentStatusButtons projectId={projectId} itemId={itemId} status={status} />;
}

// Client controls imported below
import { ContentStatusButtons } from "./content-status";
