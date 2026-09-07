import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// GET /api/sessions/[sessionId]/answered-count/[sessionQuestionId]
//
// Just a count - no answer content, no player identities. Safe to
// call anytime (question active OR closed), unlike the results route
// which only makes sense once a question has closed. Uses the
// service-role client since player_answers has no public select
// policy, but the only thing this route exposes is a number.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionQuestionId: string }> },
) {
  const { sessionQuestionId } = await params;
  const supabase = createServiceClient();

  const { count, error } = await supabase
    .from("player_answers")
    .select("id", { count: "exact", head: true })
    .eq("session_question_id", sessionQuestionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ count: count ?? 0 });
}