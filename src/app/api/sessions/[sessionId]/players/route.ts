import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sessions/[sessionId]/players
// Used by the waiting lobby (player app) and the host lobby view.
// `players` has a public select policy, so the regular client is fine.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("players")
    .select("id, nickname, joined_at")
    .eq("session_id", sessionId)
    .order("joined_at");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ players: data });
}
