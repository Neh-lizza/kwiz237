"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Lock, Check, Users } from "lucide-react";
import PlayerHeader from "@/components/PlayerHeader";
import { getPlayerSession } from "@/lib/player-session";

export default function AnswerSubmittedPage() {
  const router = useRouter();
  const [answeredCount, setAnsweredCount] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);

  const poll = useCallback(async () => {
    const stored = getPlayerSession();
    if (!stored) {
      router.push("/join");
      return;
    }

    try {
      const [questionRes, playersRes] = await Promise.all([
        fetch(`/api/sessions/${stored.sessionId}/current-question`),
        fetch(`/api/sessions/${stored.sessionId}/players`),
      ]);
      const questionData = await questionRes.json();
      const playersData = await playersRes.json();

      if (playersRes.ok) setTotalPlayers(playersData.players.length);

      if (questionData.state === "closed" || questionData.state === "revealed") {
        router.push("/play/result");
        return;
      }

      if (stored.lastSessionQuestionId) {
        const resultsRes = await fetch(
          `/api/sessions/${stored.sessionId}/results/${stored.lastSessionQuestionId}`,
        );
        if (resultsRes.ok) {
          const resultsData = await resultsRes.json();
          setAnsweredCount(resultsData.total ?? 0);
        }
      }
    } catch {
      // keep retrying silently
    }
  }, [router]);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, 1500);
    return () => clearInterval(interval);
  }, [poll]);

  return (
    <div className="min-h-screen flex flex-col">
      <PlayerHeader status="Answer locked" progressPct={40} />
      <main className="flex-1 pt-24 px-5 pb-6 flex flex-col max-w-md mx-auto w-full relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/5 animate-ping pointer-events-none" />

        <div className="flex flex-col items-center text-center pb-6 relative z-10 animate-fade-in-up">
          <div className="relative w-24 h-24 flex items-center justify-center mb-2">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-20 h-20 bg-primary text-white rounded-full shadow-lg flex items-center justify-center">
              <Lock size={32} />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-surface text-primary rounded-full flex items-center justify-center shadow-md">
                <Check size={16} />
              </div>
            </div>
          </div>
          <h2 className="font-display font-bold text-xl text-text">
            Locked In!
          </h2>
          <p className="text-sm text-text-muted max-w-[260px] mt-1">
            Hold tight. Waiting for the rest of the players to finish...
          </p>
        </div>

        <div className="mt-auto pt-8 relative z-10">
          <div className="w-full bg-background rounded-full p-1 shadow-inner relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-primary/10 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${totalPlayers ? (answeredCount / totalPlayers) * 100 : 0}%`,
              }}
            />
            <div className="relative z-10 w-full flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Users className="text-primary animate-pulse" size={18} />
                <span className="font-mono-caps text-[11px] text-text-muted uppercase tracking-wider">
                  Players Answered
                </span>
              </div>
              <div className="font-display font-bold text-lg text-primary">
                {answeredCount}
                <span className="text-sm text-text-muted font-normal">
                  /{totalPlayers}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
