"use client";

import { useEffect, useState } from "react";
import { Lock, Check, Users } from "lucide-react";
import PlayerHeader from "@/components/PlayerHeader";

const options = [
  { label: "A", text: "Gone with the Wind" },
  { label: "B", text: "Citizen Kane" },
  { label: "C", text: "Casablanca" },
  { label: "D", text: "The Godfather" },
];
const selected = "C";
const MAX_PLAYERS = 50;

export default function AnswerSubmittedPage() {
  const [count, setCount] = useState(38);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (count >= MAX_PLAYERS) return;
    const t = setTimeout(() => {
      setCount((c) => Math.min(c + (Math.random() > 0.7 ? 2 : 1), MAX_PLAYERS));
      setBump(true);
      setTimeout(() => setBump(false), 300);
    }, 2500);
    return () => clearTimeout(t);
  }, [count]);

  const pct = (count / MAX_PLAYERS) * 100;

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

        <div className="bg-surface rounded-xl p-4 mb-6 shadow-sm opacity-90 border border-disabled/50 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-mono-caps text-[10px] uppercase">
              Pop Culture
            </span>
            <span className="text-text-muted font-mono-caps text-[10px]">
              Question 4 of 10
            </span>
          </div>
          <h3 className="font-semibold text-text">
            Which iconic movie features the quote, &ldquo;Here&rsquo;s
            looking at you, kid&rdquo;?
          </h3>
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          {options.map((opt) =>
            opt.label === selected ? (
              <div
                key={opt.label}
                className="w-full rounded-xl bg-primary text-white p-4 flex items-center gap-3 shadow-lg"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-white/20 flex items-center justify-center font-display font-bold">
                  {opt.label}
                </div>
                <span className="flex-grow font-semibold text-left">
                  {opt.text}
                </span>
                <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Check size={16} />
                </div>
              </div>
            ) : (
              <div
                key={opt.label}
                className="w-full rounded-xl bg-surface p-4 flex items-center gap-3 opacity-40 border border-disabled/50"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-background flex items-center justify-center font-display font-bold text-text-muted">
                  {opt.label}
                </div>
                <span className="text-text">{opt.text}</span>
              </div>
            ),
          )}
        </div>

        <div className="mt-auto pt-8 relative z-10">
          <div className="w-full bg-background rounded-full p-1 shadow-inner relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-primary/10 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${pct}%` }}
            />
            <div className="relative z-10 w-full flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Users className="text-primary animate-pulse" size={18} />
                <span className="font-mono-caps text-[11px] text-text-muted uppercase tracking-wider">
                  Players Answered
                </span>
              </div>
              <div className="font-display font-bold text-lg text-primary flex items-baseline gap-1">
                <span className={bump ? "text-secondary scale-110 transition-transform" : "transition-transform"}>
                  {count}
                </span>
                <span className="text-sm text-text-muted font-normal">
                  /{MAX_PLAYERS}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
