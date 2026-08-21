import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sessions/[sessionId]/results/[sessionQuestionId]?playerId=xxx
//
// Returns aggregate counts for the public display (how many players
// picked each option - no names, no individual scores) and, if a
// playerId query param is given, that one player's own result.
// This is what keeps "players can't see other players' scores"
// true even though the database itself won't let a player query
// player_answers directly at all.
export async function GET(
  request: Request,
  {
    params,
  }: { params: Promise<{ sessionId: string; sessionQuestionId: string }> },
) {
  const { sessionQuestionId } = await params;
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get("playerId");

  const supabase = await createClient();

  const { data: sq } = await supabase
    .from("session_questions")
    .select("state, questions(id, type, config, points)")
    .eq("id", sessionQuestionId)
    .single();

  if (!sq || (sq.state !== "closed" && sq.state !== "revealed")) {
    return NextResponse.json(
      { error: "Results are not available yet" },
      { status: 400 },
    );
  }

  const { data: answers } = await supabase
    .from("player_answers")
    .select("answer, is_correct, points_earned, player_id")
    .eq("session_question_id", sessionQuestionId);

  const total = answers?.length ?? 0;

  // Aggregate counts per answer value, without any player identity -
  // safe to show on the public display.
  const counts: Record<string, number> = {};
  for (const a of answers ?? []) {
    const key = JSON.stringify(a.answer);
    counts[key] = (counts[key] ?? 0) + 1;
  }

  const response: {
    total: number;
    counts: Record<string, number>;
    correctAnswer?: unknown;
    yourResult?: { isCorrect: boolean | null; pointsEarned: number } | null;
  } = { total, counts };

  if (sq.state === "revealed") {
    const question = sq.questions as unknown as { type: string; config: Record<string, unknown> };
    if (question.type === "multiple_choice" || question.type === "image_choice") {
      response.correctAnswer = question.config.correctOptionId;
    } else if (question.type === "true_false") {
      response.correctAnswer = question.config.correctAnswer;
    } else if (question.type === "ranking") {
      response.correctAnswer = question.config.correctOrder;
    }
  }

  if (playerId) {
    const mine = answers?.find((a) => a.player_id === playerId);
    response.yourResult = mine
      ? { isCorrect: mine.is_correct, pointsEarned: mine.points_earned }
      : null;
  }

  return NextResponse.json(response);
}
