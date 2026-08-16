"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import PlayerHeader from "@/components/PlayerHeader";

export default function RoundResultPage() {
  const [correct, setCorrect] = useState(true);
  const particleRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Shake animation on the incorrect-state icon, replayed each time it appears
  useEffect(() => {
    if (correct || !heroRef.current) return;
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
  }, [correct]);

  // Floating particles rising behind the incorrect-state card
  useEffect(() => {
    const container = particleRef.current;
    if (!container || correct) return;
    container.innerHTML = "";
    const colors = ["#dc2626", "#ffdad6"];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement("div");
      const size = Math.random() * 8 + 4;
      p.style.position = "absolute";
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.borderRadius = "50%";
      p.style.left = `${Math.random() * 100}%`;
      p.style.bottom = "-10px";
      p.style.opacity = "0";
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 1;
      p.animate(
        [
          { transform: "translateY(0) scale(1)", opacity: 0 },
          { offset: 0.2, opacity: 0.6 },
          { transform: "translateY(-420px) scale(0.5)", opacity: 0 },
        ],
        {
          duration: duration * 1000,
          delay: delay * 1000,
          iterations: Infinity,
          easing: "ease-in-out",
        },
      );
      container.appendChild(p);
    }
  }, [correct]);

  return (
    <div className="min-h-screen flex flex-col">
      <PlayerHeader status="Result" progressPct={40} />
      <main className="flex-1 pt-24 px-5 pb-6 flex flex-col items-center max-w-md mx-auto w-full relative overflow-hidden">
        {!correct && (
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
            correct ? "bg-correct text-white" : "bg-incorrect text-white"
          }`}
        >
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            {correct ? <Check size={40} /> : <X size={40} />}
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl">
              {correct ? "Correct!" : "Incorrect!"}
            </h2>
            <p className="opacity-90 mt-1">
              {correct ? "Nice one, keep it up." : "Not quite right this time."}
            </p>
          </div>

          <div className="w-full bg-white/15 rounded-xl p-4 mt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="opacity-90 text-sm">Points Earned</span>
              <span className="font-display font-bold text-lg">
                {correct ? "+120" : "+0"}
              </span>
            </div>
            <div className="w-full h-px bg-white/20 mb-2" />
            <div className="flex justify-between items-center">
              <span className="opacity-90 text-sm">Total Score</span>
              <span className="font-display font-bold text-xl">1,240</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full bg-surface rounded-xl p-4 mt-4 shadow-sm border border-disabled/50">
          <p className="font-mono-caps text-[10px] text-text-muted uppercase mb-1">
            The correct answer was
          </p>
          <p className="font-semibold text-primary">C. Casablanca</p>
        </div>

        <button className="relative z-10 w-full h-14 bg-primary text-white rounded-xl font-semibold shadow-md active:scale-95 transition-transform mt-6">
          Next Question
        </button>

        {/* Dev-only toggle to preview both states */}
        <button
          onClick={() => setCorrect((c) => !c)}
          className="relative z-10 mt-4 text-xs text-text-muted underline"
        >
          Toggle correct/incorrect preview
        </button>
      </main>
    </div>
  );
}
