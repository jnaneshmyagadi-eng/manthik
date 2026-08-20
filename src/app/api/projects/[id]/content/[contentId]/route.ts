import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const patchSchema = z.object({
  title: z.string().max(300).optional(),
  body: z.string().max(20000).optional(),
  hook: z.string().max(1000).optional(),
  cta: z.string().max(500).optional(),
  status: z.enum(["draft", "ready", "scheduled", "published", "archived"]).optional(),
  performance: z.record(z.unknown()).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; contentId: string }> }
) {
  const { id, contentId } = await params;
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

  const updates: Record<string, unknown> = {
    ...parsed.data,
    updated_at: new Date().toISOString(),
  };
  if (parsed.data.status === "published") {
    updates.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("content_items")
    .update(updates)
    .eq("id", contentId)
    .eq("project_id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; contentId: string }> }
) {
  const { id, contentId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("content_items")
    .delete()
    .eq("id", contentId)
    .eq("project_id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
