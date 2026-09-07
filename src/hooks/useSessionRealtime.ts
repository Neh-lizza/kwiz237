"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface SessionRealtimeCallbacks {
  /** Fires on any UPDATE to this session's own quiz_sessions row -
   * status changes (lobby -> active -> completed), current_question_index. */
  onSessionChange?: (
    payload: RealtimePostgresChangesPayload<Record<string, unknown>>,
  ) => void;
  /** Fires on INSERT/UPDATE to any session_questions row belonging to
   * this session - state transitions (pending/active/closed/revealed). */
  onQuestionChange?: (
    payload: RealtimePostgresChangesPayload<Record<string, unknown>>,
  ) => void;
  /** Fires when a new player joins this session. */
  onPlayerJoin?: (
    payload: RealtimePostgresChangesPayload<Record<string, unknown>>,
  ) => void;
  /**
   * Fires on INSERT/UPDATE to player_answers - but ONLY delivers
   * anything for an authenticated host viewing their own session.
   * player_answers has no public select policy, so Realtime's RLS
   * check silently drops these events for anonymous (player/display)
   * clients - only pass this callback from host-side pages. There's
   * no per-session filter available at the subscription level here
   * (player_answers has no session_id column), so check
   * payload.new.session_question_id against whatever question you
   * currently care about inside your callback.
   */
  onAnswerChange?: (
    payload: RealtimePostgresChangesPayload<Record<string, unknown>>,
  ) => void;
}

/**
 * Subscribes to real-time changes for one session: its own status row,
 * its questions' state transitions, and new player joins. This covers
 * everything EXCEPT answer counts/results, which stay on a lightweight
 * poll elsewhere since player_answers has no public RLS read policy -
 * Realtime can't push what a direct query isn't allowed to read either.
 *
 * Pass a stable sessionId (or null to skip subscribing, e.g. before
 * a session id has been resolved yet).
 */
export function useSessionRealtime(
  sessionId: string | null,
  callbacks: SessionRealtimeCallbacks,
) {
  // Keep the latest callbacks in a ref so the effect below doesn't
  // need to re-subscribe every time a parent re-renders with new
  // (but functionally identical) inline callback functions.
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    if (!sessionId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`session-realtime-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "quiz_sessions",
          filter: `id=eq.${sessionId}`,
        },
        (payload) => callbacksRef.current.onSessionChange?.(payload),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_questions",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => callbacksRef.current.onQuestionChange?.(payload),
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "players",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => callbacksRef.current.onPlayerJoin?.(payload),
      );

    // Only subscribe to player_answers if a caller actually wants it -
    // no point paying for an extra subscription that most pages
    // (anonymous players/display) can't receive anything from anyway.
    if (callbacksRef.current.onAnswerChange) {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table: "player_answers" },
        (payload) => callbacksRef.current.onAnswerChange?.(payload),
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);
}