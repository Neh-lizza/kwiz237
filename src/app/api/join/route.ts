import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/join
// Body: { code: string, nickname: string }
// No auth required - this is how anonymous players enter a session.
export async function POST(request: Request) {
  const { code, nickname } = (await request.json()) as {
    code: string;
    nickname: string;
  };

  if (!code || !nickname) {
    return NextResponse.json(
      { error: "code and nickname are required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .select("id, status")
    .eq("code", code.toUpperCase())
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status === "completed") {
    return NextResponse.json(
      { error: "This session has already ended" },
      { status: 400 },
    );
  }

  const { data: player, error: playerError } = await supabase
    .from("players")
    .insert({ session_id: session.id, nickname })
    .select()
    .single();

  if (playerError) {
    // Most likely cause: the (session_id, nickname) unique constraint -
    // someone else in this session already has that nickname.
    if (playerError.code === "23505") {
      return NextResponse.json(
        { error: "That nickname is already taken in this session" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: playerError.message }, { status: 500 });
  }

  return NextResponse.json({
    sessionId: session.id,
    playerId: player.id,
    clientToken: player.client_token,
  });
}
