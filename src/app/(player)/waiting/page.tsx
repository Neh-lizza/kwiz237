"use client";

import { useEffect, useState } from "react";
import {
  Brain,
  Rocket,
  Lightbulb,
  Loader2,
  ChevronRight,
  Home,
  Trophy,
  History,
  Hourglass,
} from "lucide-react";
import PlayerHeader from "@/components/PlayerHeader";

const joinedPlayers = [
  { name: "QuizWhiz", icon: Brain },
  { name: "QuantumLeap", icon: Rocket },
  { name: "BrightSpark", icon: Lightbulb },
];

export default function WaitingForHostPage() {
  const [players, setPlayers] = useState(joinedPlayers);
  const [showJoining, setShowJoining] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setPlayers((p) => [...p, { name: "TriviaTitan", icon: Brain }]);
      setShowJoining(false);
      setTimeout(() => setShowJoining(true), 1200);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <PlayerHeader status="Lobby" />
      <main className="flex-1 pt-24 pb-24 px-5 flex flex-col max-w-md mx-auto w-full relative">
        <div className="absolute -top-10 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center gap-2 mb-6 relative z-10">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping [animation-duration:3s]" />
            <div className="absolute inset-0 rounded-full bg-secondary/20 animate-ping [animation-duration:3s] [animation-delay:1s]" />
            <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center relative z-10 shadow-lg">
              <span className="text-4xl">🥔</span>
            </div>
          </div>
          <h1 className="font-display font-bold text-lg text-text text-center mt-2">
            You are playing as
          </h1>
          <p className="font-display font-extrabold text-2xl text-primary text-center">
            CosmicPotato99
          </p>
        </div>

        <div className="w-full bg-surface rounded-xl shadow-sm p-5 flex flex-col items-center mb-6 relative overflow-hidden z-10">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]" />
          <div className="w-14 h-14 rounded-full bg-secondary/15 flex items-center justify-center mb-2 text-secondary">
            <Hourglass className="animate-spin-slow" size={26} />
          </div>
          <h2 className="font-display font-bold text-text">
            Waiting for host...
          </h2>
          <p className="text-sm text-text-muted mt-1">
            The quiz will begin shortly.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-lg text-text">
              Players Joined
            </h3>
            <div className="bg-background px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-mono-caps text-[11px] text-text-muted">
                {players.length}/50
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {players.map((p) => (
              <div
                key={p.name}
                className="w-full bg-secondary/10 rounded-lg p-3 flex items-center justify-between shadow-sm transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                    <p.icon className="text-text-muted" size={18} />
                  </div>
                  <span className="font-semibold text-sm text-text">
                    {p.name}
                  </span>
                </div>
                <ChevronRight className="text-secondary" size={18} />
              </div>
            ))}
            {showJoining && (
              <div className="w-full bg-background rounded-lg p-3 flex items-center gap-3 border border-dashed border-disabled opacity-70">
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                  <Loader2 className="text-text-muted animate-spin" size={18} />
                </div>
                <span className="text-sm text-text-muted italic">
                  Someone is joining...
                </span>
              </div>
            )}
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 w-full bg-surface/90 backdrop-blur-xl border-t border-disabled/60 shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 flex items-center justify-around px-6 max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1 text-primary">
            <Home size={20} />
            <span className="font-mono-caps text-[10px] uppercase">
              Lobby
            </span>
          </button>
          <button className="flex flex-col items-center gap-1 text-text-muted">
            <Trophy size={20} />
            <span className="font-mono-caps text-[10px] uppercase">
              Live
            </span>
          </button>
          <button className="flex flex-col items-center gap-1 text-text-muted">
            <History size={20} />
            <span className="font-mono-caps text-[10px] uppercase">
              Past
            </span>
          </button>
        </div>
      </nav>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 4s linear infinite; }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>
    </div>
  );
}
