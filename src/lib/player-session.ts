"use client";

/**
 * Stores the current player's identity in localStorage so it
 * survives page navigation and reloads. Not auth - just a way for
 * this browser tab to remember "I am player X in session Y" between
 * /join, /waiting, /play, and /play/result.
 */
const KEY = "kwiz237_player_session";

export interface PlayerSession {
  sessionId: string;
  playerId: string;
  nickname: string;
  sessionCode: string;
  /** The most recent question this player answered - used by
   * /play/submitted and /play/result to know which results to fetch. */
  lastSessionQuestionId?: string;
}

export function savePlayerSession(session: PlayerSession) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function getPlayerSession(): PlayerSession | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PlayerSession;
  } catch {
    return null;
  }
}

export function clearPlayerSession() {
  localStorage.removeItem(KEY);
}
