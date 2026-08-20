import { createClient } from "@/lib/supabase/server";
import { runFullIntelligence } from "@/lib/ai/orchestrator";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string().min(1).max(120),
  product_url: z.string().url().optional().or(z.literal("")),
  description: z.string().max(2000).optional(),
  target_market: z.string().max(500).optional(),
  current_stage: z.enum(["idea", "mvp", "launched", "growing", "scaling"]).optional(),
  current_users: z.number().int().min(0).optional(),
  main_goal: z.string().max(500).optional(),
});

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ projects: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;

  // Ensure profile exists
  await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
  });

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: input.name,
      product_url: input.product_url || null,
      description: input.description || null,
      target_market: input.target_market || null,
      current_stage: input.current_stage || "idea",
      current_users: input.current_users ?? 0,
      main_goal: input.main_goal || null,
      status: "draft",
    })
    .select("*")
    .single();

  if (error || !project) {
    return NextResponse.json({ error: error?.message || "Failed to create project" }, { status: 500 });
  }

  await supabase.from("project_members").insert({
    project_id: project.id,
    user_id: user.id,
    role: "owner",
  });

  // Run intelligence pipeline (demo or live)
  try {
    await runFullIntelligence({
      id: project.id,
      name: project.name,
      product_url: project.product_url,
      description: project.description,
      target_market: project.target_market,
      main_goal: project.main_goal,
    });
  } catch (e) {
    console.error("Intelligence pipeline error", e);
  }

  return NextResponse.json({ project }, { status: 201 });
}
