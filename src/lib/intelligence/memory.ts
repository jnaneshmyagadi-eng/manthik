import { createClient } from "@/lib/supabase/server";

export type MemoryEvent = {
  type: "task_completed" | "task_skipped" | "experiment_result" | "insight";
  title: string;
  detail?: string;
  channel?: string | null;
  outcome?: "success" | "fail" | "neutral";
  meta?: Record<string, unknown>;
};

/** Append event to projects.memory and ai_insights */
export async function writeGrowthMemory(projectId: string, event: MemoryEvent) {
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("memory")
    .eq("id", projectId)
    .single();

  const prev = (project?.memory as Record<string, unknown>) || {};
  const events = Array.isArray(prev.events) ? (prev.events as unknown[]) : [];
  const entry = {
    ...event,
    at: new Date().toISOString(),
  };
  events.unshift(entry);
  const trimmed = events.slice(0, 100);

  const completed = Number(prev.tasks_completed || 0) + (event.type === "task_completed" ? 1 : 0);
  const skipped = Number(prev.tasks_skipped || 0) + (event.type === "task_skipped" ? 1 : 0);

  const channelStats = (prev.channels as Record<string, { done: number; skipped: number }>) || {};
  if (event.channel) {
    const ch = channelStats[event.channel] || { done: 0, skipped: 0 };
    if (event.type === "task_completed") ch.done += 1;
    if (event.type === "task_skipped") ch.skipped += 1;
    channelStats[event.channel] = ch;
  }

  await supabase
    .from("projects")
    .update({
      memory: {
        ...prev,
        events: trimmed,
        tasks_completed: completed,
        tasks_skipped: skipped,
        channels: channelStats,
        updated_at: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId);

  await supabase.from("ai_insights").insert({
    project_id: projectId,
    category: event.type,
    title: event.title,
    body: event.detail || null,
    priority: event.outcome === "success" ? 2 : 5,
    metadata: { channel: event.channel, outcome: event.outcome, ...(event.meta || {}) },
  });
}
