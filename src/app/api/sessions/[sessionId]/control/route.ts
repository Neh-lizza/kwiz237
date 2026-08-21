import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Action = "start" | "launch" | "close" | "reveal" | "next" | "end";

// POST /api/sessions/[sessionId]/control
// Body: { action: "start" | "launch" | "close" | "reveal" | "next" | "end" }
//
// This is the single choke point for advancing game state - the
// server is authoritative here, never the client. Every action
// re-derives the current session_question from the database rather
// than trusting an id the client sends, so a host client can't skip
// or replay states out of order.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action } = (await request.json()) as { action: Action };

  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("host_id", user.id)
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (action === "start") {
    const { error } = await supabase
      .from("quiz_sessions")
      .update({ status: "active", started_at: new Date().toISOString() })
      .eq("id", sessionId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "end") {
    const { error } = await supabase
      .from("quiz_sessions")
      .update({ status: "completed", ended_at: new Date().toISOString() })
      .eq("id", sessionId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  // launch / close / reveal / next all operate on session_questions
  const { data: currentSQ } = await supabase
    .from("session_questions")
    .select("*")
    .eq("session_id", sessionId)
    .eq("position", session.current_question_index)
    .single();

  if (action === "launch") {
    if (!currentSQ) {
      return NextResponse.json(
        { error: "No question at the current position" },
        { status: 400 },
      );
    }
    const { error } = await supabase
      .from("session_questions")
      .update({ state: "active", activated_at: new Date().toISOString() })
      .eq("id", currentSQ.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "close") {
    if (!currentSQ) {
      return NextResponse.json(
        { error: "No active question to close" },
        { status: 400 },
      );
    }
    const { error } = await supabase
      .from("session_questions")
      .update({ state: "closed", closed_at: new Date().toISOString() })
      .eq("id", currentSQ.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Scoring happens server-side, right when the question closes -
    // never trust a client-computed score.
    await scoreQuestion(supabase, currentSQ.id, session.scoring_config);

    return NextResponse.json({ success: true });
  }

  if (action === "reveal") {
    if (!currentSQ) {
      return NextResponse.json(
        { error: "No question to reveal" },
        { status: 400 },
      );
    }
    const { error } = await supabase
      .from("session_questions")
      .update({ state: "revealed" })
      .eq("id", currentSQ.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "next") {
    const { error } = await supabase
      .from("quiz_sessions")
      .update({ current_question_index: session.current_question_index + 1 })
      .eq("id", sessionId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

/**
 * Grades every submitted answer for a question the moment it closes.
 * Ungraded types (word_cloud, rating_scale, open_text without
 * acceptedAnswers) get is_correct = null and 0 points - they're
 * survey-style, not scored.
 */
async function scoreQuestion(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sessionQuestionId: string,
  scoringConfig: { pointsCorrect?: number },
) {
  const { data: sq } = await supabase
    .from("session_questions")
    .select("*, questions(*)")
    .eq("id", sessionQuestionId)
    .single();
  if (!sq) return;

  const question = sq.questions as unknown as {
    type: string;
    config: Record<string, unknown>;
    points: number;
  };

  const { data: answers } = await supabase
    .from("player_answers")
    .select("*")
    .eq("session_question_id", sessionQuestionId);
  if (!answers) return;

  const pointsCorrect = question.points ?? scoringConfig?.pointsCorrect ?? 100;

  for (const answer of answers) {
    let isCorrect: boolean | null = null;

    if (question.type === "multiple_choice" || question.type === "image_choice") {
      isCorrect = answer.answer === question.config.correctOptionId;
    } else if (question.type === "true_false") {
      isCorrect = answer.answer === question.config.correctAnswer;
    } else if (question.type === "ranking") {
      isCorrect =
        JSON.stringify(answer.answer) ===
        JSON.stringify(question.config.correctOrder);
    } else if (
      question.type === "open_text" &&
      Array.isArray(question.config.acceptedAnswers)
    ) {
      const accepted = (question.config.acceptedAnswers as string[]).map((a) =>
        a.trim().toLowerCase(),
      );
      isCorrect = accepted.includes(String(answer.answer).trim().toLowerCase());
    }
    // word_cloud, rating_scale, and open_text without an answer key
    // stay is_correct = null (ungraded).

    await supabase
      .from("player_answers")
      .update({
        is_correct: isCorrect,
        points_earned: isCorrect ? pointsCorrect : 0,
      })
      .eq("id", answer.id);
  }
}
