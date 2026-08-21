import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH  /api/questions/[id] - update a question
// DELETE /api/questions/[id] - delete a question
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const allowedFields = [
    "prompt",
    "category_id",
    "difficulty",
    "time_limit_seconds",
    "points",
    "image_url",
    "config",
    "status",
  ];
  const updates: Record<string, unknown> = {};
  for (const key of allowedFields) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    if (camelKey in body) updates[key] = body[camelKey];
  }

  // RLS also enforces this, but checking host_id explicitly here gives
  // a clean 403 instead of a silent "0 rows updated".
  const { data, error } = await supabase
    .from("questions")
    .update(updates)
    .eq("id", id)
    .eq("host_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ question: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", id)
    .eq("host_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
