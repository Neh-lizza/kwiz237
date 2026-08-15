"use client";

import { useState } from "react";
import { Hash, Smile, ArrowRight } from "lucide-react";

export default function JoinPage() {
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [joining, setJoining] = useState(false);
  const [shake, setShake] = useState(false);

  function handleJoin() {
    if (!code || !nickname) {
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return;
    }
    setJoining(true);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-2 animate-fade-in-up">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg rotate-3">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-text tracking-tight">
            Kwiz237
          </h1>
          <p className="text-sm text-text-muted px-4">
            Enter the session code from your host to jump in.
          </p>
        </div>

        <div
          className={`flex flex-col gap-4 bg-surface rounded-2xl p-6 shadow-sm border border-disabled/60 transition-transform ${shake ? "animate-[shake_0.3s_ease-in-out]" : ""}`}
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sessionCode"
              className="font-mono-caps text-[11px] text-text-muted ml-1"
            >
              Session Code
            </label>
            <div className="relative">
              <Hash
                className="absolute left-3 top-1/2 -translate-y-1/2 text-disabled"
                size={18}
              />
              <input
                id="sessionCode"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. 7A9B2"
                className="w-full bg-background text-text rounded-xl py-3 pl-10 pr-3 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="nickname"
              className="font-mono-caps text-[11px] text-text-muted ml-1"
            >
              Nickname
            </label>
            <div className="relative">
              <Smile
                className="absolute left-3 top-1/2 -translate-y-1/2 text-disabled"
                size={18}
              />
              <input
                id="nickname"
                maxLength={16}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="CoolCat99"
                className="w-full bg-background text-text rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            onClick={handleJoin}
            disabled={joining}
            className="mt-1 w-full bg-primary text-white font-semibold py-4 rounded-2xl shadow-[0_8px_16px_rgba(8,217,214,0.25)] active:scale-[0.98] active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            {joining ? "Joining..." : "Join Game"}
            {!joining && <ArrowRight size={18} />}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
