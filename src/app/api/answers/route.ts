import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/answers
// Body: { sessionQuestionId, playerId, answer }
// RLS also enforces "only while the question is active", but we
// re-check here too so we can return a clear error message instead
// of a generic RLS-denied failure.
export async function POST(request: Request) {
  const { sessionQuestionId, playerId, answer } = (await request.json()) as {
    sessionQuestionId: string;
    playerId: string;
    answer: unknown;
  };

  if (!sessionQuestionId || !playerId || answer === undefined) {
    return NextResponse.json(
      { error: "sessionQuestionId, playerId, and answer are required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { data: sq } = await supabase
    .from("session_questions")
    .select("state")
    .eq("id", sessionQuestionId)
    .single();

  if (!sq || sq.state !== "active") {
    return NextResponse.json(
      { error: "This question is no longer accepting answers" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("player_answers")
    .insert({
      session_question_id: sessionQuestionId,
      player_id: playerId,
      answer,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "You already answered this question" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ answer: data }, { status: 201 });
}
