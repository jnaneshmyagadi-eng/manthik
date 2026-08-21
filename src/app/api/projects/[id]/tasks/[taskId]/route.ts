import { createClient } from "@/lib/supabase/server";
import { writeGrowthMemory } from "@/lib/intelligence/memory";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const { id, taskId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const status = body.status as string | undefined;
  if (!status || !["todo", "in_progress", "done", "skipped"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("growth_tasks")
    .update({
      status,
      completed_at: status === "done" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .eq("project_id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (status === "done" || status === "skipped") {
    try {
      await writeGrowthMemory(id, {
        type: status === "done" ? "task_completed" : "task_skipped",
        title: data.title,
        detail: data.why || undefined,
        channel: data.channel,
        outcome: status === "done" ? "success" : "neutral",
        meta: { task_id: taskId, impact: data.impact },
      });
    } catch (e) {
      console.error("memory write failed", e);
    }
  }

  return NextResponse.json({ task: data });
}
