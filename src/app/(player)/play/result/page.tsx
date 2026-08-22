"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import PlayerHeader from "@/components/PlayerHeader";
import { getPlayerSession } from "@/lib/player-session";

export default function RoundResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<{
    isCorrect: boolean | null;
    pointsEarned: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const particleRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const fetchResult = useCallback(async () => {
    const stored = getPlayerSession();
    if (!stored) {
      router.push("/join");
      return;
    }
    if (!stored.lastSessionQuestionId) {
      router.push("/play");
      return;
    }

    try {
      const res = await fetch(
        `/api/sessions/${stored.sessionId}/results/${stored.lastSessionQuestionId}?playerId=${stored.playerId}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data.yourResult) {
          setResult(data.yourResult);
        } else {
          // Ungraded question type (word cloud, rating scale) - no
          // correct/incorrect state, just acknowledge the submission.
          setResult({ isCorrect: null, pointsEarned: 0 });
        }
        setLoading(false);
      }
    } catch {
      // keep the loading state and let the caller retry
    }
  }, [router]);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  const correct = result?.isCorrect === true;

  // Shake animation on the incorrect-state icon
  useEffect(() => {
    if (correct || !heroRef.current || loading) return;
    heroRef.current.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-12px)" },
        { transform: "translateX(10px)" },
        { transform: "translateX(-8px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 500, easing: "cubic-bezier(.36,.07,.19,.97)" },
    );
  }, [correct, loading]);

  function handleNext() {
    router.push("/play");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <PlayerHeader status="Result" progressPct={40} />
        <p className="text-text-muted mt-16">Loading your result...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PlayerHeader status="Result" progressPct={40} />
      <main className="flex-1 pt-24 px-5 pb-6 flex flex-col items-center max-w-md mx-auto w-full relative overflow-hidden">
        {!correct && result?.isCorrect !== null && (
          <>
            <div
              ref={particleRef}
              className="absolute inset-0 pointer-events-none z-0"
            />
            <div
              className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, var(--color-incorrect) 0, var(--color-incorrect) 2px, transparent 2px, transparent 16px), repeating-linear-gradient(-45deg, var(--color-incorrect) 0, var(--color-incorrect) 2px, transparent 2px, transparent 16px)",
              }}
            />
          </>
        )}

        <div
          ref={heroRef}
          className={`relative z-10 w-full rounded-2xl p-8 flex flex-col items-center text-center gap-4 shadow-lg ${
            result?.isCorrect === null
              ? "bg-secondary text-white"
              : correct
                ? "bg-correct text-white"
                : "bg-incorrect text-white"
          }`}
        >
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            {result?.isCorrect === null ? (
              <Check size={40} />
            ) : correct ? (
              <Check size={40} />
            ) : (
              <X size={40} />
            )}
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl">
              {result?.isCorrect === null
                ? "Answer Recorded"
                : correct
                  ? "Correct!"
                  : "Incorrect!"}
            </h2>
            <p className="opacity-90 mt-1">
              {result?.isCorrect === null
                ? "Thanks for your response."
                : correct
                  ? "Nice one, keep it up."
                  : "Not quite right this time."}
            </p>
          </div>

          {result?.isCorrect !== null && (
            <div className="w-full bg-white/15 rounded-xl p-4 mt-2">
              <div className="flex justify-between items-center">
                <span className="opacity-90 text-sm">Points Earned</span>
                <span className="font-display font-bold text-lg">
                  +{result?.pointsEarned ?? 0}
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          className="relative z-10 w-full h-14 bg-primary text-white rounded-xl font-semibold shadow-md active:scale-95 transition-transform mt-6"
        >
          Next Question
        </button>
      </main>
    </div>
  );
}
