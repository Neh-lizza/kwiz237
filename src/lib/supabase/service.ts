import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client - BYPASSES Row Level Security entirely.
 * Server-only, never import this in a "use client" file or expose
 * SUPABASE_SERVICE_ROLE_KEY with a NEXT_PUBLIC_ prefix.
 *
 * Use this ONLY when:
 *   1. The caller (player) has no auth.uid() so RLS would block a
 *      read that is actually legitimate (e.g. reading aggregate
 *      answer counts, or a player reading their own single result),
 *      AND
 *   2. The route's own code - not the database - is what guarantees
 *      the response is sanitized before it goes out (no other
 *      players' identities, no early answer keys, etc).
 *
 * Every other route should keep using the regular server client
 * from ./server.ts, which respects RLS as originally designed.
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
