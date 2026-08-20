import { createClient } from "@/lib/supabase/server";
import { demoContentDrafts } from "@/lib/ai/content-demo";
import { isLiveAI } from "@/lib/ai/provider";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("content_items")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data, isDemo: !isLiveAI() });
}

const generateSchema = z.object({
  platform: z
    .enum(["X", "LinkedIn", "Instagram", "YouTube", "Reddit", "Blog", "Product Hunt"])
    .optional(),
  count: z.number().int().min(1).max(8).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, description, main_goal")
    .eq("id", id)
    .single();

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Demo mode only until AI_API_KEY is configured
  let drafts = demoContentDrafts({
    name: project.name,
    goal: project.main_goal,
    description: project.description,
  });

  if (parsed.data.platform) {
    drafts = drafts.filter((d) => d.platform === parsed.data.platform);
    if (drafts.length === 0) {
      drafts = [
        {
          platform: parsed.data.platform,
          title: `${parsed.data.platform} draft for ${project.name}`,
          hook: `A focused angle for ${project.name}`,
          body: `Draft body for ${parsed.data.platform}. Connect AI for live generation.\n\nGoal: ${project.main_goal || "grow"}\n\n(Demo)`,
          cta: "Learn more",
        },
      ];
    }
  }

  const limit = parsed.data.count ?? drafts.length;
  drafts = drafts.slice(0, limit);

  const inserted = [];
  for (const d of drafts) {
    const { data, error } = await supabase
      .from("content_items")
      .insert({
        project_id: id,
        platform: d.platform,
        title: d.title,
        hook: d.hook,
        body: d.body,
        cta: d.cta,
        status: "draft",
        source: "demo",
      })
      .select("*")
      .single();
    if (!error && data) inserted.push(data);
  }

  await supabase.from("ai_runs").insert({
    project_id: id,
    user_id: user.id,
    agent: "ContentAgent",
    status: "completed",
    is_demo: true,
    output: { count: inserted.length, platforms: inserted.map((i) => i.platform) },
    completed_at: new Date().toISOString(),
  });

  return NextResponse.json({ items: inserted, isDemo: true }, { status: 201 });
}
