"use client";

import { useEffect, useState, useCallback, use } from "react";
import { Sparkles, Users, Trophy, PartyPopper, CheckCircle2 } from "lucide-react";
import DisplayHeader from "@/components/DisplayHeader";
import CountdownTimer from "@/components/CountdownTimer";
import { safeFetchJson } from "@/lib/safe-fetch";

interface SessionInfo {
  id: string;
  name: string;
  status: string;
}

interface CurrentQuestion {
  state: "pending" | "active" | "closed" | "revealed" | "none";
  sessionQuestionId?: string;
  question?: {
    prompt: string;
    type: string;
    timeLimitSeconds: number;
    config: Record<string, unknown>;
  };
}

interface Results {
  total: number;
  counts: Record<string, number>;
  correctAnswer?: unknown;
}

interface LeaderboardEntry {
  nickname: string;
  score: number;
}

const optionColors = ["bg-option-a", "bg-option-b", "bg-option-c", "bg-option-d"];

export default function LiveDisplayPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [current, setCurrent] = useState<CurrentQuestion | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Resolve the code to a session id once.
  useEffect(() => {
    safeFetchJson<{ id?: string }>(`/api/sessions/by-code/${code}`).then(
      ({ data }) => {
        if (data?.id) setSessionId(data.id);
      },
    );
  }, [code]);

  const poll = useCallback(async () => {
    if (!sessionId) return;

    const [{ ok: sOk, data: sData }, { ok: pOk, data: pData }] =
      await Promise.all([
        safeFetchJson<SessionInfo>(`/api/sessions/${sessionId}`),
        safeFetchJson<{ players: unknown[] }>(
          `/api/sessions/${sessionId}/players`,
        ),
      ]);
    // If this cycle's requests failed or came back empty (e.g. a dev
    // hot-reload interrupted them), just skip - the next interval
    // tick will retry rather than clearing what's currently on screen.
    if (!sOk || !sData) return;
    setSession(sData);
    if (pOk && pData) setPlayerCount(pData.players.length);

    if (sData.status === "active") {
      const { data: cqData } = await safeFetchJson<CurrentQuestion>(
        `/api/sessions/${sessionId}/current-question`,
      );
      if (!cqData) return;
      setCurrent(cqData);

      if (cqData.state === "closed" || cqData.state === "revealed") {
        const { ok: rOk, data: rData } = await safeFetchJson<Results>(
          `/api/sessions/${sessionId}/results/${cqData.sessionQuestionId}`,
        );
        if (rOk && rData) setResults(rData);
      }
    }

    if (sData.status === "completed") {
      const { ok: lOk, data: lData } = await safeFetchJson<{
        leaderboard: LeaderboardEntry[];
      }>(`/api/sessions/${sessionId}/leaderboard`);
      if (lOk && lData) setLeaderboard(lData.leaderboard);
    }
  }, [sessionId]);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [poll]);

  if (!session) {
    return (
      <div className="min-h-screen bg-display-bg text-display-text flex items-center justify-center">
        <p>Connecting to session {code}...</p>
      </div>
    );
  }

  // ---------------- LOBBY ----------------
  if (session.status === "lobby") {
    return (
      <div className="min-h-screen bg-display-bg text-display-text flex flex-col">
        <DisplayHeader sessionCode={code} />
        <main className="flex-1 pt-32 pb-16 flex flex-col items-center justify-center px-8">
          <div className="bg-white/5 backdrop-blur-md rounded-full px-5 py-2 mb-10 flex items-center gap-2">
            <Sparkles className="text-primary" size={20} />
            <h1 className="font-display font-bold text-lg">{session.name}</h1>
          </div>
          <p className="text-2xl opacity-80 mb-2">Join at</p>
          <div className="bg-primary/15 rounded-lg px-6 py-3 mb-8">
            <p className="font-display font-extrabold text-4xl text-primary tracking-widest">
              {code}
            </p>
          </div>
          <div className="flex items-center gap-2 text-display-text/80">
            <Users size={22} />
            <p className="text-xl">
              <strong className="text-primary font-bold">{playerCount}</strong>{" "}
              Players Joined
            </p>
          </div>
          <p className="mt-4 font-mono-caps text-[11px] opacity-50">
            Waiting for host to start...
          </p>
        </main>
      </div>
    );
  }

  // ---------------- ACTIVE QUESTION ----------------
  if (session.status === "active" && current?.state === "active" && current.question) {
    const options =
      (current.question.config.options as { id: string; label: string; text?: string }[]) ?? [];
    return (
      <div className="min-h-screen bg-display-bg text-display-text flex flex-col">
        <DisplayHeader sessionCode={code} />
        <main className="flex-1 pt-32 pb-16 px-8 flex flex-col items-center max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between w-full mb-10">
            <span className="px-3 py-1.5 bg-white/10 rounded-full font-mono-caps text-[11px] tracking-widest">
              {playerCount} PLAYERS
            </span>
            <CountdownTimer seconds={current.question.timeLimitSeconds} size={110} />
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-center leading-tight mb-12 max-w-4xl">
            {current.question.prompt}
          </h1>
          {options.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {options.map((opt, i) => (
                <div
                  key={opt.id}
                  className={`${optionColors[i % optionColors.length]} rounded-2xl p-6 flex items-center gap-4 shadow-lg min-h-[100px]`}
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 border-2 border-white/30 font-display font-bold text-xl">
                    {opt.label}
                  </div>
                  <span className="font-semibold text-2xl">{opt.text ?? ""}</span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ---------------- RESULTS (closed or revealed) ----------------
  if (session.status === "active" && (current?.state === "closed" || current?.state === "revealed") && results) {
    const total = results.total || 1;
    return (
      <div className="min-h-screen bg-display-bg text-display-text flex flex-col">
        <DisplayHeader sessionCode={code} />
        <main className="flex-1 pt-32 pb-16 px-8 flex flex-col items-center max-w-4xl mx-auto w-full gap-8">
          <span className="inline-flex px-3 py-1.5 rounded-full bg-white/10 font-mono-caps text-[11px] tracking-widest uppercase">
            {results.total} responses received
          </span>
          <div className="w-full flex flex-col gap-3">
            {Object.entries(results.counts).map(([key, count]) => {
              const isCorrect =
                current?.state === "revealed" &&
                JSON.stringify(results.correctAnswer) === key;
              return (
                <div
                  key={key}
                  className={`rounded-xl p-4 flex items-center gap-4 ${
                    isCorrect ? "bg-correct" : "bg-white/5"
                  }`}
                >
                  <span className="font-mono-caps text-sm w-32 truncate">
                    {key.replace(/"/g, "")}
                  </span>
                  <div className="flex-1 h-6 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isCorrect ? "bg-white/40" : "bg-primary"}`}
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-display font-bold">
                    {count}
                  </span>
                  {isCorrect && <CheckCircle2 size={22} />}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // ---------------- COMPLETED: FINAL LEADERBOARD ----------------
  if (session.status === "completed") {
    return (
      <div className="min-h-screen bg-display-bg text-display-text flex flex-col">
        <DisplayHeader sessionCode={code} />
        <main className="flex-1 pt-32 pb-16 px-8 max-w-4xl mx-auto w-full flex flex-col items-center">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center bg-white/5 rounded-full px-4 py-2 mb-4 border border-white/10">
              <Trophy className="text-option-d mr-2" size={20} />
              <span className="font-mono-caps text-[11px] tracking-widest">
                FINAL RESULTS
              </span>
            </div>
            <h1 className="font-display font-extrabold text-4xl flex items-center gap-2">
              Quiz Complete!
              <PartyPopper className="text-secondary" size={32} />
            </h1>
          </div>
          <div className="w-full flex flex-col gap-3">
            {leaderboard.slice(0, 8).map((p, i) => (
              <div
                key={p.nickname}
                className={`flex items-center justify-between rounded-xl p-4 shadow-sm ${
                  i === 0
                    ? "bg-gradient-to-r from-primary to-secondary"
                    : "bg-white/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full shrink-0">
                    <span className="font-display font-bold">{i + 1}</span>
                  </div>
                  <span className="font-semibold text-lg">{p.nickname}</span>
                </div>
                <span className="font-display font-bold text-lg">
                  {p.score.toLocaleString()} pts
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-display-bg text-display-text flex items-center justify-center">
      <p>Waiting for the next question...</p>
    </div>
  );
}
