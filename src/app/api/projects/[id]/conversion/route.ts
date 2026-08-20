import { createClient } from "@/lib/supabase/server";
import { demoConversionReport } from "@/lib/ai/conversion-demo";
import { NextResponse } from "next/server";

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

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, product_url, description, memory")
    .eq("id", id)
    .single();

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const report = demoConversionReport({
    name: project.name,
    product_url: project.product_url,
    description: project.description,
  });

  const memory = (project.memory as Record<string, unknown>) || {};
  await supabase
    .from("projects")
    .update({
      memory: {
        ...memory,
        conversion: { ...report, updated_at: new Date().toISOString() },
      },
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  await supabase.from("ai_insights").insert({
    project_id: id,
    category: "conversion",
    title: `Conversion score: ${report.conversion_score}`,
    body: report.summary,
    priority: 80,
    metadata: report,
  });

  await supabase.from("ai_runs").insert({
    project_id: id,
    user_id: user.id,
    agent: "ConversionAgent",
    status: "completed",
    is_demo: true,
    output: report,
    completed_at: new Date().toISOString(),
  });

  return NextResponse.json({ report, isDemo: true });
}

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

  const { data: project } = await supabase
    .from("projects")
    .select("memory")
    .eq("id", id)
    .single();

  const memory = (project?.memory as Record<string, unknown>) || {};
  return NextResponse.json({ report: memory.conversion || null, isDemo: true });
}
