import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sessions/[sessionId]
// Basic session info - status, name, current position, total question
// count. Public: quiz_sessions already has a "select using (true)"
// policy so any player can look this up.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const supabase = await createClient();

  const { data: session, error } = await supabase
    .from("quiz_sessions")
    .select("id, name, status, current_question_index")
    .eq("id", sessionId)
    .single();

  if (error || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { count } = await supabase
    .from("session_questions")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId);

  return NextResponse.json({
    id: session.id,
    name: session.name,
    status: session.status,
    currentQuestionIndex: session.current_question_index,
    totalQuestions: count ?? 0,
  });
}
