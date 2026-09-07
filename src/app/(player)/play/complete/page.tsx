"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Target, Timer, ArrowRight } from "lucide-react";
import PlayerHeader from "@/components/PlayerHeader";
import { getPlayerSession, clearPlayerSession } from "@/lib/player-session";

interface ScoreData {
  totalScore: number;
  correctCount: number;
  incorrectCount: number;
  rank: number;
  totalPlayers: number;
  fastestAnswerSeconds: number | null;
}

export default function SessionCompletePage() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [data, setData] = useState<ScoreData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const load = useCallback(async () => {
    const stored = getPlayerSession();
    if (!stored) {
      router.push("/join");
      return;
    }
    const res = await fetch(
      `/api/sessions/${stored.sessionId}/score?playerId=${stored.playerId}`,
    );
    if (res.ok) {
      setData(await res.json());
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  // Animated score counter, driven by the real total once it loads
  useEffect(() => {
    if (!data) return;
    let raf: number;
    const start = performance.now();
    const duration = 1500;
    const target = data.totalScore;
    const step = (t: number) => {
      const progress = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setScore(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [data]);

  // Lightweight confetti
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#08D9D6", "#FF2E63", "#FFC93C", "#6D28D9"];
    const pieces = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 8 + 4,
      c: colors[Math.floor(Math.random() * colors.length)],
      dy: Math.random() * 2.5 + 1.5,
      dx: Math.random() * 2 - 1,
      rot: Math.random() * 360,
      dRot: Math.random() * 4 - 2,
    }));

    let raf: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.y += p.dy;
        p.x += p.dx;
        p.rot += p.dRot;
        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
      });
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  function handleBackToLobby() {
    clearPlayerSession();
    router.push("/join");
  }

  const totalAnswered = (data?.correctCount ?? 0) + (data?.incorrectCount ?? 0);
  const accuracyPct =
    totalAnswered > 0
      ? Math.round(((data?.correctCount ?? 0) / totalAnswered) * 100)
      : 0;
  const rankSuffix = (n: number) => {
    if (n % 10 === 1 && n % 100 !== 11) return "st";
    if (n % 10 === 2 && n % 100 !== 12) return "nd";
    if (n % 10 === 3 && n % 100 !== 13) return "rd";
    return "th";
  };

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <PlayerHeader status="Session complete" />
        <p className="text-text-muted mt-16">Tallying final scores...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <PlayerHeader status="Session complete" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 w-full h-full"
      />
      <main className="flex-1 pt-24 px-5 pb-6 flex flex-col items-center max-w-md mx-auto w-full relative z-10 gap-5">
        <div className="flex flex-col items-center text-center gap-2 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-secondary/15 text-secondary flex items-center justify-center relative">
            <Trophy size={28} />
            <div className="absolute inset-0 rounded-full border-4 border-secondary/30 animate-ping" />
          </div>
          <h1 className="font-display font-bold text-2xl text-primary">
            Quiz Complete!
          </h1>
          <p className="text-sm text-text-muted">
            {data.rank === 1
              ? "You came out on top!"
              : "Great effort out there."}
          </p>
        </div>

        <div className="w-full rounded-2xl bg-primary text-white p-6 flex flex-col items-center shadow-xl">
          <p className="font-mono-caps text-[11px] opacity-80 uppercase mb-1">
            Total Score
          </p>
          <div className="font-display font-extrabold text-5xl tracking-tight mb-3">
            {score.toLocaleString()}
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="bg-option-d h-full rounded-full transition-all duration-1000"
              style={{
                width: `${data.totalPlayers ? 100 - ((data.rank - 1) / data.totalPlayers) * 100 : 100}%`,
              }}
            />
          </div>
          <p className="text-sm opacity-80">
            Rank {data.rank} of {data.totalPlayers} players
          </p>
        </div>

        <div className="w-full grid grid-cols-2 gap-3">
          <div className="bg-surface rounded-xl p-4 flex flex-col items-center shadow-sm border border-disabled/50">
            <Trophy className="text-secondary mb-1" size={24} />
            <p className="font-display font-bold text-lg text-text">
              {data.rank}
              {rankSuffix(data.rank)}
            </p>
            <p className="font-mono-caps text-[10px] text-text-muted mt-1">
              Final Rank
            </p>
          </div>
          <div className="bg-surface rounded-xl p-4 flex flex-col items-center shadow-sm border border-disabled/50 relative overflow-hidden">
            <svg
              className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
              viewBox="0 0 100 100"
            >
              <circle
                className="text-option-c"
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="251"
                strokeDashoffset={251 - (accuracyPct / 100) * 251}
              />
            </svg>
            <Target className="text-option-c mb-1 relative z-10" size={24} />
            <p className="font-display font-bold text-lg text-text relative z-10">
              {accuracyPct}%
            </p>
            <p className="font-mono-caps text-[10px] text-text-muted mt-1 relative z-10">
              Accuracy
            </p>
          </div>
          <div className="col-span-2 bg-surface rounded-xl p-4 flex items-center justify-between shadow-sm border border-disabled/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary/15 text-secondary flex items-center justify-center">
                <Timer size={18} />
              </div>
              <div>
                <p className="font-mono-caps text-[10px] text-text-muted">
                  Fastest Answer
                </p>
                <p className="text-sm text-text font-semibold">
                  {data.fastestAnswerSeconds !== null
                    ? `${data.fastestAnswerSeconds.toFixed(1)}s`
                    : "No graded answers"}
                </p>
              </div>
            </div>
            {data.rank === 1 && (
              <span className="text-[10px] font-bold text-option-d uppercase tracking-wider bg-option-d/10 px-2 py-1 rounded-full rotate-3 inline-block animate-pulse">
                Top Score!
              </span>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 mt-2">
          <button
            onClick={handleBackToLobby}
            className="w-full bg-primary text-white font-semibold py-4 rounded-full shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            Join Another Session
            <ArrowRight size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}
