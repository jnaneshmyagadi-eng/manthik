import { createClient } from "@/lib/supabase/server";
import { runFullIntelligence } from "@/lib/ai/orchestrator";
import { NextResponse } from "next/server";

/** Re-run product intelligence for a project (live page fetch when URL present). */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: project, error } = await supabase
    .from("projects")
    .select("id, name, product_url, description, target_market, main_goal, user_id")
    .eq("id", id)
    .single();

  if (error || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  if (project.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await runFullIntelligence({
      id: project.id,
      name: project.name,
      product_url: project.product_url,
      description: project.description,
      target_market: project.target_market,
      main_goal: project.main_goal,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Intelligence failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
