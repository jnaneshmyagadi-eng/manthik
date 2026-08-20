import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const patchSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  hypothesis: z.string().min(1).max(2000).optional(),
  status: z.enum(["draft", "running", "completed", "failed", "cancelled"]).optional(),
  channel: z.string().max(100).optional().nullable(),
  metric: z.string().max(100).optional().nullable(),
  result: z.enum(["win", "loss", "inconclusive"]).optional().nullable(),
  results_data: z.record(z.unknown()).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; expId: string }> }
) {
  const { id, expId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === "running" && !updates.started_at) {
    updates.started_at = new Date().toISOString();
  }
  if (
    parsed.data.status === "completed" ||
    parsed.data.status === "failed" ||
    parsed.data.status === "cancelled"
  ) {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("growth_experiments")
    .update(updates)
    .eq("id", expId)
    .eq("project_id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Write-back to growth memory on completed experiments
  if (data && (data.status === "completed" || data.status === "failed")) {
    const { data: project } = await supabase
      .from("projects")
      .select("memory")
      .eq("id", id)
      .single();
    const memory = (project?.memory as Record<string, unknown>) || {};
    const experiments = Array.isArray(memory.experiments) ? memory.experiments : [];
    experiments.push({
      id: data.id,
      name: data.name,
      result: data.result,
      status: data.status,
      channel: data.channel,
      at: new Date().toISOString(),
    });
    await supabase
      .from("projects")
      .update({
        memory: { ...memory, experiments: experiments.slice(-50) },
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  }

  return NextResponse.json({ experiment: data });
}
