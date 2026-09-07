import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// GET /api/sessions/[sessionId]/leaderboard
// Public: used by the final leaderboard display and by /play/complete
// to compute an individual player's rank. Only ever returns nickname
// + total score, sorted - nothing else about any player.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const supabase = createServiceClient();

  const { data: players } = await supabase
    .from("players")
    .select("id, nickname")
    .eq("session_id", sessionId);

  const { data: sessionQuestions } = await supabase
    .from("session_questions")
    .select("id")
    .eq("session_id", sessionId);

  const sqIds = (sessionQuestions ?? []).map((sq) => sq.id);

  const scoreByPlayer = new Map<string, number>();
  if (sqIds.length > 0) {
    const { data: answers } = await supabase
      .from("player_answers")
      .select("player_id, points_earned")
      .in("session_question_id", sqIds);

    for (const a of answers ?? []) {
      scoreByPlayer.set(
        a.player_id,
        (scoreByPlayer.get(a.player_id) ?? 0) + (a.points_earned ?? 0),
      );
    }
  }

  const leaderboard = (players ?? [])
    .map((p) => ({
      nickname: p.nickname,
      score: scoreByPlayer.get(p.id) ?? 0,
    }))
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({ leaderboard });
}
