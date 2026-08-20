import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./sign-out";

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!project) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm space-y-2">
        <div>
          <span className="text-[var(--muted)]">Project:</span> {project.name}
        </div>
        <div>
          <span className="text-[var(--muted)]">Account:</span> {user.email}
        </div>
      </div>
      <div className="mt-6">
        <SignOutButton />
      </div>
      <p className="mt-8 text-xs text-[var(--muted)]">
        Billing plans (Free / Pro / Growth / Agency) are architected via profiles.plan — not charged yet.
      </p>
    </div>
  );
}
