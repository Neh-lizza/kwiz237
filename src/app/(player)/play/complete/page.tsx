"use client";

import { useEffect, useRef, useState } from "react";
import { Trophy, Target, Timer, ArrowRight } from "lucide-react";
import PlayerHeader from "@/components/PlayerHeader";

const TARGET_SCORE = 8450;

export default function SessionCompletePage() {
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated score counter
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 1500;
    const step = (t: number) => {
      const progress = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setScore(Math.floor(eased * TARGET_SCORE));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

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

    const colors = ["#08D9D6", "#FF2E63", "#FFC93C", "#252A34"];
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
          <p className="text-sm text-text-muted">Incredible performance.</p>
        </div>

        <div className="w-full rounded-2xl bg-primary text-white p-6 flex flex-col items-center shadow-xl">
          <p className="font-mono-caps text-[11px] opacity-80 uppercase mb-1">
            Total Score
          </p>
          <div className="font-display font-extrabold text-5xl tracking-tight mb-3">
            {score.toLocaleString()}
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-2 overflow-hidden">
            <div className="bg-option-d h-full rounded-full w-[85%]" />
          </div>
          <p className="text-sm opacity-80">Top 15% of players today</p>
        </div>

        <div className="w-full grid grid-cols-2 gap-3">
          <div className="bg-surface rounded-xl p-4 flex flex-col items-center shadow-sm border border-disabled/50">
            <Trophy className="text-secondary mb-1" size={24} />
            <p className="font-display font-bold text-lg text-text">3rd</p>
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
                strokeDashoffset="37"
              />
            </svg>
            <Target className="text-option-c mb-1 relative z-10" size={24} />
            <p className="font-display font-bold text-lg text-text relative z-10">
              85%
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
                <p className="text-sm text-text font-semibold">1.2s (Q4)</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-option-d uppercase tracking-wider bg-option-d/10 px-2 py-1 rounded-full rotate-3 inline-block animate-pulse">
              New PB!
            </span>
          </div>
        </div>

        <div className="w-full text-center relative z-10">
          <span className="font-mono-caps text-[10px] text-text-muted inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Question 10 of 10
          </span>
        </div>

        <div className="w-full flex flex-col gap-2 mt-2">
          <button className="w-full bg-primary text-white font-semibold py-4 rounded-full shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            Back to Lobby
            <ArrowRight size={18} />
          </button>
          <button className="w-full bg-transparent text-primary font-semibold py-4 rounded-full active:bg-primary/10 transition-colors">
            View Full Results
          </button>
        </div>
      </main>
    </div>
  );
}
