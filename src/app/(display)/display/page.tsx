"use client";

import Link from "next/link";
import { useState } from "react";

const stages = [
  { href: "/display/waiting", label: "Waiting Lobby (preview)" },
  { href: "/display/question", label: "Active Question (preview)" },
  { href: "/display/results", label: "Question Results (preview)" },
  { href: "/display/leaderboard", label: "Final Leaderboard (preview)" },
];

export default function DisplayIndexPage() {
  const [code, setCode] = useState("");

  return (
    <div className="min-h-screen bg-display-bg text-display-text flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="font-display font-bold text-2xl">Public Display</h1>

      <div className="w-full max-w-xs flex flex-col gap-2">
        <p className="text-sm text-display-text/70 text-center">
          Enter a live session code to show the real, auto-updating display
        </p>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="CODE"
            maxLength={5}
            className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-center uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Link
            href={code ? `/display/live/${code}` : "#"}
            className="bg-primary text-white rounded-lg px-4 py-2 font-semibold"
          >
            Go
          </Link>
        </div>
      </div>

      <p className="text-display-text/60 text-sm text-center max-w-sm mt-4">
        Or preview each static stage with sample data:
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {stages.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="text-center bg-white/5 hover:bg-white/10 rounded-xl py-3 transition-colors border border-white/10"
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
