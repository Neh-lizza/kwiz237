import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeQuestionConfig } from "@/lib/sanitize-question";

// GET /api/sessions/[sessionId]/current-question
// Used by both the player app and the public display. Returns the
// session's current question with the correct-answer fields stripped
// out - this route is the ONLY way either client ever sees question
// data, so the stripping happens here once rather than being
// re-implemented (and possibly forgotten) in multiple places.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .select("current_question_index")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { data: sq, error: sqError } = await supabase
    .from("session_questions")
    .select("id, state, position, activated_at, questions(*)")
    .eq("session_id", sessionId)
    .eq("position", session.current_question_index)
    .single();

  if (sqError || !sq) {
    return NextResponse.json({ state: "none" });
  }

  // Pending questions are invisible to players/display entirely -
  // not even the sanitized shape goes out until the host launches it.
  if (sq.state === "pending") {
    return NextResponse.json({ state: "pending" });
  }

  const question = sq.questions as unknown as {
    id: string;
    type: string;
    prompt: string;
    category_id: string | null;
    image_url: string | null;
    time_limit_seconds: number;
    points: number;
    config: Record<string, unknown>;
  };

  const includeAnswerKey = sq.state === "revealed";

  return NextResponse.json({
    sessionQuestionId: sq.id,
    state: sq.state,
    position: sq.position,
    activatedAt: sq.activated_at,
    question: {
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      imageUrl: question.image_url,
      timeLimitSeconds: question.time_limit_seconds,
      points: question.points,
      // Only include the correct-answer fields once the host has
      // actually revealed this question - never before.
      config: includeAnswerKey
        ? question.config
        : sanitizeQuestionConfig(
            question.type as never,
            question.config,
          ),
    },
  });
}
