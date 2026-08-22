"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hash, Smile, ArrowRight, Wine, Code2, ChevronRight, Zap } from "lucide-react";
import { savePlayerSession } from "@/lib/player-session";

const recentSessions = [
  { title: "Weekly Trivia Night", meta: "Last played 2 days ago", icon: Wine, color: "bg-secondary/15 text-secondary" },
  { title: "Tech All-Hands Quiz", meta: "Last played 1 week ago", icon: Code2, color: "bg-option-c/15 text-option-c" },
];

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [joining, setJoining] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleJoin() {
    const badCode = code.length < 5;
    const badName = nickname.trim().length === 0;
    if (badCode || badName) {
      setCodeError(badCode);
      setNameError(badName);
      setTimeout(() => {
        setCodeError(false);
        setNameError(false);
      }, 500);
      return;
    }

    setServerError(null);
    setJoining(true);

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, nickname }),
      });
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error ?? "Could not join that session");
        setJoining(false);
        return;
      }

      savePlayerSession({
        sessionId: data.sessionId,
        playerId: data.playerId,
        nickname,
        sessionCode: code,
      });
      router.push("/waiting");
    } catch {
      setServerError("Network error - check your connection and try again");
      setJoining(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-5 py-10 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(8,217,214,0.15) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="w-full max-w-md flex flex-col items-center relative z-10">
        <div className="mb-6 text-center">
          <h1 className="font-display font-extrabold text-3xl text-primary flex items-center justify-center gap-2">
            <Zap size={36} fill="currentColor" />
            Kwiz237
          </h1>
          <p className="text-sm text-text-muted mt-2">
            Get ready to buzz in!
          </p>
        </div>

        <div className="w-full bg-surface rounded-xl shadow-lg p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-option-c" />

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
                maxLength={5}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter 5-character code"
                className={`w-full bg-background text-text rounded-lg py-3 pl-10 pr-3 uppercase tracking-widest text-center focus:outline-none focus:ring-2 transition-all ${
                  codeError
                    ? "ring-2 ring-incorrect animate-[shake_0.3s_ease-in-out]"
                    : "focus:ring-primary"
                }`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-4">
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
                placeholder="What should we call you?"
                className={`w-full bg-background text-text rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 transition-all ${
                  nameError
                    ? "ring-2 ring-incorrect animate-[shake_0.3s_ease-in-out]"
                    : "focus:ring-primary"
                }`}
              />
            </div>
          </div>

          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl mt-5 flex items-center justify-center gap-2 shadow-md active:scale-[0.98] active:translate-y-0.5 transition-all disabled:opacity-60"
          >
            {joining ? "Joining..." : "Join Game"}
            {!joining && <ArrowRight size={18} />}
          </button>

          {serverError && (
            <p className="text-sm text-incorrect bg-incorrect/10 rounded-lg px-3 py-2 mt-3 text-center">
              {serverError}
            </p>
          )}
        </div>

        <div className="w-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px bg-disabled flex-1" />
            <span className="font-mono-caps text-[11px] text-text-muted">
              Or Recent
            </span>
            <div className="h-px bg-disabled flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            {recentSessions.map((s) => (
              <button
                key={s.title}
                className="w-full bg-surface text-text p-3 rounded-lg flex items-center justify-between hover:bg-background transition-colors active:scale-[0.98] shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${s.color}`}
                  >
                    <s.icon size={18} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{s.title}</p>
                    <p className="text-xs text-text-muted">{s.meta}</p>
                  </div>
                </div>
                <ChevronRight className="text-disabled" size={18} />
              </button>
            ))}
          </div>
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
