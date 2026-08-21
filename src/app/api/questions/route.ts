import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET  /api/questions        - list the logged-in host's question bank
// POST /api/questions        - create a new question
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("questions")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ questions: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    type,
    prompt,
    categoryId,
    difficulty,
    timeLimitSeconds,
    points,
    imageUrl,
    config,
  } = body;

  if (!type || !prompt || !config) {
    return NextResponse.json(
      { error: "type, prompt, and config are required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("questions")
    .insert({
      host_id: user.id,
      type,
      prompt,
      category_id: categoryId ?? null,
      difficulty: difficulty ?? null,
      time_limit_seconds: timeLimitSeconds ?? 20,
      points: points ?? 100,
      image_url: imageUrl ?? null,
      config,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ question: data }, { status: 201 });
}
