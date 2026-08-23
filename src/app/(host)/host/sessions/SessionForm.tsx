"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface QuestionRow {
  id: string;
  type: string;
  prompt: string;
}

export default function SessionForm({
  questions,
  onCreated,
  onCancel,
}: {
  questions: QuestionRow[];
  onCreated: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || selected.length === 0) {
      setError("Give the session a name and pick at least one question");
      return;
    }
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), questionIds: selected }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Could not create session");
      return;
    }
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-disabled rounded-xl p-5 flex flex-col gap-4 max-w-2xl"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-text">New Session</h3>
        <button type="button" onClick={onCancel} className="text-text-muted">
          <X size={18} />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">
          Session name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Saturday Batch 1"
          className="w-full rounded-lg border border-disabled px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-text">
            Questions
          </label>
          <span className="text-xs text-text-muted">
            {selected.length} selected
          </span>
        </div>
        <div className="max-h-72 overflow-y-auto flex flex-col gap-1.5 border border-disabled rounded-lg p-2">
          {questions.length === 0 && (
            <p className="text-sm text-text-muted p-2">
              No questions in your bank yet - add some first.
            </p>
          )}
          {questions.map((q) => (
            <label
              key={q.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-background cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(q.id)}
                onChange={() => toggle(q.id)}
              />
              <span className="text-[10px] font-mono-caps uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded-full shrink-0">
                {q.type.replace("_", " ")}
              </span>
              <span className="text-sm text-text truncate">{q.prompt}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-incorrect">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-primary text-white rounded-lg py-2.5 font-semibold disabled:opacity-50 self-start px-6 flex items-center gap-1.5"
      >
        <Plus size={16} />
        {submitting ? "Creating..." : "Create Session"}
      </button>
    </form>
  );
}
