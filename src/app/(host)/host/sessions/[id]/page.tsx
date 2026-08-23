"use client";

import { useEffect, useState, useCallback, use } from "react";
import {
  PlayCircle,
  Rocket,
  Lock,
  Eye,
  SkipForward,
  Flag,
  Users,
  QrCode,
} from "lucide-react";

interface SessionInfo {
  id: string;
  name: string;
  status: string;
  currentQuestionIndex: number;
  totalQuestions: number;
}

interface Player {
  id: string;
  nickname: string;
}

interface CurrentQuestion {
  sessionQuestionId: string;
  state: "pending" | "active" | "closed" | "revealed" | "none";
  question?: { prompt: string; type: string };
}

interface Results {
  total: number;
  counts: Record<string, number>;
}

export default function SessionControlPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [code, setCode] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [current, setCurrent] = useState<CurrentQuestion | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const poll = useCallback(async () => {
    const [sessionsRes, statusRes, playersRes] = await Promise.all([
      fetch("/api/sessions"),
      fetch(`/api/sessions/${id}`),
      fetch(`/api/sessions/${id}/players`),
    ]);
    const sessionsData = await sessionsRes.json();
    const statusData = await statusRes.json();
    const playersData = await playersRes.json();

    if (statusRes.ok) setSession(statusData);
    if (playersRes.ok) setPlayers(playersData.players);
    if (sessionsRes.ok) {
      const match = sessionsData.sessions.find(
        (s: { id: string; code: string }) => s.id === id,
      );
      if (match) setCode(match.code);
    }

    if (statusData.status === "active") {
      const cqRes = await fetch(`/api/sessions/${id}/current-question`);
      const cqData = await cqRes.json();
      setCurrent(cqData);

      if (cqData.state === "closed" || cqData.state === "revealed") {
        const rRes = await fetch(
          `/api/sessions/${id}/results/${cqData.sessionQuestionId}`,
        );
        if (rRes.ok) setResults(await rRes.json());
      } else {
        setResults(null);
      }
    }
  }, [id]);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [poll]);

  async function sendAction(action: string) {
    setActionLoading(true);
    await fetch(`/api/sessions/${id}/control`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    await poll();
    setActionLoading(false);
  }

  if (!session) {
    return <p className="text-text-muted">Loading session...</p>;
  }

  const isLastQuestion =
    session.currentQuestionIndex + 1 >= session.totalQuestions;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">{session.name}</h1>
          <p className="text-sm text-text-muted font-mono-caps mt-1">
            #{code} &middot; {players.length} players
          </p>
        </div>
        <span
          className={`text-xs px-3 py-1.5 rounded-full font-mono-caps uppercase ${
            session.status === "active"
              ? "bg-correct/10 text-correct"
              : session.status === "completed"
                ? "bg-disabled/30 text-text-muted"
                : "bg-warning/10 text-warning"
          }`}
        >
          {session.status}
        </span>
      </div>

      {/* ---------------- LOBBY ---------------- */}
      {session.status === "lobby" && (
        <div className="bg-surface border border-disabled rounded-xl p-8 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <QrCode size={28} />
          </div>
          <div>
            <p className="text-sm text-text-muted">Share this code</p>
            <p className="font-display font-extrabold text-4xl text-primary tracking-widest mt-1">
              {code}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-text-muted">
            <Users size={16} />
            <span className="text-sm">{players.length} players joined</span>
          </div>
          <button
            onClick={() => sendAction("start")}
            disabled={actionLoading}
            className="bg-primary text-white rounded-xl px-8 py-3 font-semibold flex items-center gap-2 disabled:opacity-50 mt-2"
          >
            <PlayCircle size={20} />
            Start Session
          </button>
        </div>
      )}

      {/* ---------------- ACTIVE: CONTROL PANEL ---------------- */}
      {session.status === "active" && (
        <div className="flex flex-col gap-4">
          <div className="bg-surface border border-disabled rounded-xl p-5">
            <p className="text-xs text-text-muted font-mono-caps mb-1">
              QUESTION {session.currentQuestionIndex + 1} OF{" "}
              {session.totalQuestions}
            </p>
            <h2 className="font-display font-bold text-lg text-text">
              {current?.question?.prompt ?? "Loading question..."}
            </h2>
          </div>

          {results && (
            <div className="bg-surface border border-disabled rounded-xl p-5">
              <p className="text-sm font-semibold text-text mb-3">
                {results.total} answer{results.total === 1 ? "" : "s"}{" "}
                received
              </p>
              <div className="flex flex-col gap-2">
                {Object.entries(results.counts).map(([key, count]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs text-text-muted w-24 truncate">
                      {key}
                    </span>
                    <div className="flex-1 h-6 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${results.total ? (count / results.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-text-muted w-6 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ControlButton
              icon={Rocket}
              label="Launch"
              onClick={() => sendAction("launch")}
              disabled={actionLoading || current?.state !== "pending"}
            />
            <ControlButton
              icon={Lock}
              label="Close"
              onClick={() => sendAction("close")}
              disabled={actionLoading || current?.state !== "active"}
            />
            <ControlButton
              icon={Eye}
              label="Reveal"
              onClick={() => sendAction("reveal")}
              disabled={actionLoading || current?.state !== "closed"}
            />
            {isLastQuestion ? (
              <ControlButton
                icon={Flag}
                label="End Session"
                onClick={() => sendAction("end")}
                disabled={actionLoading || current?.state !== "revealed"}
                variant="danger"
              />
            ) : (
              <ControlButton
                icon={SkipForward}
                label="Next"
                onClick={() => sendAction("next")}
                disabled={actionLoading || current?.state !== "revealed"}
              />
            )}
          </div>
        </div>
      )}

      {/* ---------------- COMPLETED ---------------- */}
      {session.status === "completed" && (
        <div className="bg-surface border border-disabled rounded-xl p-8 text-center">
          <Flag className="mx-auto text-text-muted mb-3" size={28} />
          <p className="text-text font-semibold">This session has ended.</p>
          <p className="text-sm text-text-muted mt-1">
            {players.length} players participated.
          </p>
        </div>
      )}
    </div>
  );
}

function ControlButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  variant = "primary",
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  onClick: () => void;
  disabled: boolean;
  variant?: "primary" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl py-4 flex flex-col items-center gap-1.5 font-semibold text-sm transition-opacity disabled:opacity-30 ${
        variant === "danger"
          ? "bg-incorrect text-white"
          : "bg-primary text-white"
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );
}
