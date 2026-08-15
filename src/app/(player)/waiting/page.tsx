"use client";

import { useEffect, useState } from "react";
import { UserRound, Hourglass, LogIn } from "lucide-react";
import PlayerHeader from "@/components/PlayerHeader";

const incomingPlayers = [
  "QuantumLeap",
  "SpeedyGonzales",
  "Brainiac2000",
  "TriviaNinja",
];

export default function WaitingForHostPage() {
  const [players, setPlayers] = useState(["Nova", "Ace", "Flash"]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < incomingPlayers.length) {
        setPlayers((p) => [incomingPlayers[i], ...p]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <PlayerHeader status="Lobby" />
      <main className="flex-1 pt-24 px-5 pb-10 flex flex-col items-center max-w-md mx-auto w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 rounded-full bg-primary/15 text-primary flex items-center justify-center mb-3">
            <UserRound size={44} />
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
          </div>
          <p className="font-mono-caps text-[11px] text-text-muted mb-1">
            You are playing as
          </p>
          <h2 className="font-display font-bold text-2xl text-text text-center">
            CosmicPotato99
          </h2>
        </div>

        <div className="bg-surface rounded-2xl p-6 w-full shadow-sm mb-8 text-center flex flex-col items-center gap-1.5 border border-disabled/60">
          <Hourglass className="text-secondary animate-bounce" size={30} />
          <h3 className="font-display font-bold text-text">
            Waiting for host...
          </h3>
          <p className="text-sm text-text-muted">
            The game will begin shortly. Stay frosty!
          </p>
        </div>

        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-between items-center px-1 mb-1">
            <span className="font-mono-caps text-[11px] text-text-muted">
              Players Joined
            </span>
            <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full font-mono-caps text-[11px]">
              {players.length} / 50
            </span>
          </div>
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
            {players.map((name) => (
              <div
                key={name}
                className="bg-surface rounded-xl p-3 flex items-center gap-3 shadow-sm border border-disabled/40"
              >
                <div className="w-9 h-9 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                  <UserRound size={18} />
                </div>
                <span className="font-medium text-text truncate">{name}</span>
                <LogIn className="text-disabled ml-auto animate-pulse" size={16} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
