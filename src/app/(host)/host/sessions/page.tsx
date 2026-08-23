"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, QrCode } from "lucide-react";
import SessionForm from "./SessionForm";

interface SessionRow {
  id: string;
  name: string;
  code: string;
  status: string;
}

interface QuestionRow {
  id: string;
  type: string;
  prompt: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function loadAll() {
    setLoading(true);
    const [sRes, qRes] = await Promise.all([
      fetch("/api/sessions"),
      fetch("/api/questions"),
    ]);
    const sData = await sRes.json();
    const qData = await qRes.json();
    if (sRes.ok) setSessions(sData.sessions);
    if (qRes.ok) setQuestions(qData.questions);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Sessions</h1>
          <p className="text-sm text-text-muted mt-1">
            Each session is one live game with its own join code.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-primary text-white rounded-lg px-4 py-2 font-semibold flex items-center gap-1.5"
        >
          <Plus size={16} />
          New Session
        </button>
      </div>

      {showForm && (
        <div className="mt-6">
          <SessionForm
            questions={questions}
            onCancel={() => setShowForm(false)}
            onCreated={() => {
              setShowForm(false);
              loadAll();
            }}
          />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 max-w-3xl">
        {loading && <p className="text-sm text-text-muted">Loading...</p>}
        {!loading && sessions.length === 0 && (
          <div className="rounded-xl border border-dashed border-disabled p-8 text-center text-text-muted">
            <p className="text-sm">
              No sessions yet. Click &ldquo;New Session&rdquo; to create one.
            </p>
          </div>
        )}
        {sessions.map((s) => (
          <Link
            key={s.id}
            href={`/host/sessions/${s.id}`}
            className="bg-surface border border-disabled rounded-xl p-4 flex items-center justify-between hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <QrCode size={18} />
              </div>
              <div>
                <p className="font-semibold text-text">{s.name}</p>
                <p className="text-xs text-text-muted font-mono-caps">
                  #{s.code}
                </p>
              </div>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full font-mono-caps uppercase ${
                s.status === "active"
                  ? "bg-correct/10 text-correct"
                  : s.status === "completed"
                    ? "bg-disabled/30 text-text-muted"
                    : "bg-warning/10 text-warning"
              }`}
            >
              {s.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
