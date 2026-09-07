import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sessions/by-code/[code]
// Used by the public display to resolve a session code into an id
// before it starts polling status/current-question. Public: same
// "select using (true)" policy as looking it up by id.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: session, error } = await supabase
    .from("quiz_sessions")
    .select("id, name, status")
    .eq("code", code.toUpperCase())
    .single();

  if (error || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(session);
}
