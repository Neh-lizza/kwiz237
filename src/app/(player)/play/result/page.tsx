"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import PlayerHeader from "@/components/PlayerHeader";

export default function RoundResultPage() {
  const [correct, setCorrect] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <PlayerHeader status="Result" />
      <main className="flex-1 pt-24 px-5 pb-6 flex flex-col items-center max-w-md mx-auto w-full">
        <div
          className={`w-full rounded-2xl p-8 flex flex-col items-center text-center gap-4 shadow-lg ${
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
              {correct ? "Nice one, keep it up." : "Ouch, that was a tough one."}
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

        <div className="w-full bg-surface rounded-xl p-4 mt-4 shadow-sm border border-disabled/50">
          <p className="font-mono-caps text-[10px] text-text-muted uppercase mb-1">
            The correct answer was
          </p>
          <p className="font-semibold text-primary">C. Casablanca</p>
        </div>

        <button className="w-full h-14 bg-primary text-white rounded-xl font-semibold shadow-md active:scale-95 transition-transform mt-6">
          Next Question
        </button>

        {/* Dev-only toggle to preview both states */}
        <button
          onClick={() => setCorrect((c) => !c)}
          className="mt-4 text-xs text-text-muted underline"
        >
          Toggle correct/incorrect preview
        </button>
      </main>
    </div>
  );
}
