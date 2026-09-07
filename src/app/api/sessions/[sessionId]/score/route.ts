import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// GET /api/sessions/[sessionId]/score?playerId=xxx
//
// Returns this player's total score, correct/incorrect counts, rank
// among everyone in the session, and their fastest answer. Uses the
// service-role client since it needs every player's answers to
// compute rank - but only ever returns the requesting player's own
// numbers plus their position in the standings, never anyone else's
// identity or answers.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get("playerId");

  if (!playerId) {
    return NextResponse.json({ error: "playerId is required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: sessionQuestions } = await supabase
    .from("session_questions")
    .select("id, activated_at")
    .eq("session_id", sessionId);

  const sqIds = (sessionQuestions ?? []).map((sq) => sq.id);
  const activatedAt = new Map(
    (sessionQuestions ?? []).map((sq) => [sq.id, sq.activated_at]),
  );

  if (sqIds.length === 0) {
    return NextResponse.json({
      totalScore: 0,
      correctCount: 0,
      incorrectCount: 0,
      rank: 1,
      totalPlayers: 0,
      fastestAnswerSeconds: null,
    });
  }

  const { data: answers } = await supabase
    .from("player_answers")
    .select("player_id, session_question_id, is_correct, points_earned, submitted_at")
    .in("session_question_id", sqIds);

  // Aggregate per player so we can rank the requesting player
  // against everyone else without exposing anyone else's row.
  const totals = new Map<
    string,
    { score: number; correct: number; incorrect: number }
  >();
  for (const a of answers ?? []) {
    const entry = totals.get(a.player_id) ?? {
      score: 0,
      correct: 0,
      incorrect: 0,
    };
    entry.score += a.points_earned ?? 0;
    if (a.is_correct === true) entry.correct += 1;
    if (a.is_correct === false) entry.incorrect += 1;
    totals.set(a.player_id, entry);
  }

  const ranked = Array.from(totals.entries()).sort(
    (a, b) => b[1].score - a[1].score,
  );
  const rank = ranked.findIndex(([id]) => id === playerId) + 1;
  const mine = totals.get(playerId) ?? { score: 0, correct: 0, incorrect: 0 };

  let fastestSeconds: number | null = null;
  for (const a of answers ?? []) {
    if (a.player_id !== playerId) continue;
    const started = activatedAt.get(a.session_question_id);
    if (!started) continue;
    const seconds =
      (new Date(a.submitted_at).getTime() - new Date(started).getTime()) / 1000;
    if (fastestSeconds === null || seconds < fastestSeconds) {
      fastestSeconds = seconds;
    }
  }

  return NextResponse.json({
    totalScore: mine.score,
    correctCount: mine.correct,
    incorrectCount: mine.incorrect,
    rank: rank || ranked.length + 1,
    totalPlayers: ranked.length,
    fastestAnswerSeconds: fastestSeconds,
  });
}
