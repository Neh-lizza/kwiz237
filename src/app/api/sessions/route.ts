import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSessionCode } from "@/lib/session-code";

// GET  /api/sessions - list the host's sessions
// POST /api/sessions - create a session and attach a set of questions
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ sessions: data });
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
  const { name, eventId, questionIds, scoringConfig } = body as {
    name: string;
    eventId?: string;
    questionIds: string[];
    scoringConfig?: Record<string, unknown>;
  };

  if (!name || !Array.isArray(questionIds) || questionIds.length === 0) {
    return NextResponse.json(
      { error: "name and at least one questionId are required" },
      { status: 400 },
    );
  }

  // Retry a few times on the unlikely chance of a code collision
  // (unique constraint on quiz_sessions.code catches it either way).
  let session = null;
  let lastError = null;
  for (let attempt = 0; attempt < 5 && !session; attempt++) {
    const code = generateSessionCode();
    const { data, error } = await supabase
      .from("quiz_sessions")
      .insert({
        host_id: user.id,
        event_id: eventId ?? null,
        name,
        code,
        scoring_config: scoringConfig ?? undefined,
      })
      .select()
      .single();
    if (data) session = data;
    lastError = error;
  }

  if (!session) {
    return NextResponse.json(
      { error: lastError?.message ?? "Could not generate a unique session code" },
      { status: 500 },
    );
  }

  const sessionQuestions = questionIds.map((questionId, index) => ({
    session_id: session.id,
    question_id: questionId,
    position: index,
  }));

  const { error: sqError } = await supabase
    .from("session_questions")
    .insert(sessionQuestions);

  if (sqError) {
    return NextResponse.json({ error: sqError.message }, { status: 500 });
  }

  return NextResponse.json({ session }, { status: 201 });
}
