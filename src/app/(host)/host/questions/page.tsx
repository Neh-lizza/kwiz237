"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, X } from "lucide-react";
import QuestionForm from "./QuestionForm";

interface Category {
  id: string;
  name: string;
}

interface QuestionRow {
  id: string;
  type: string;
  prompt: string;
  difficulty: string | null;
  status: string;
  categories: { name: string } | null;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function loadAll() {
    setLoading(true);
    const [qRes, cRes] = await Promise.all([
      fetch("/api/questions"),
      fetch("/api/categories"),
    ]);
    const qData = await qRes.json();
    const cData = await cRes.json();
    if (qRes.ok) setQuestions(qData.questions);
    if (cRes.ok) setCategories(cData.categories);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this question? This can't be undone.")) return;
    const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Question Bank</h1>
          <p className="text-sm text-text-muted mt-1">
            Reusable questions across all your sessions.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-primary text-white rounded-lg px-4 py-2 font-semibold flex items-center gap-1.5"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Close" : "New Question"}
        </button>
      </div>

      {showForm && (
        <div className="mt-6">
          <QuestionForm
            categories={categories}
            onCreated={() => {
              setShowForm(false);
              loadAll();
            }}
          />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 max-w-3xl">
        {loading && <p className="text-sm text-text-muted">Loading...</p>}
        {!loading && questions.length === 0 && (
          <div className="rounded-xl border border-dashed border-disabled p-8 text-center text-text-muted">
            <p className="text-sm">
              No questions yet. Click &ldquo;New Question&rdquo; to add your
              first one.
            </p>
          </div>
        )}
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-surface border border-disabled rounded-xl p-4 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono-caps uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {q.type.replace("_", " ")}
                </span>
                {q.categories?.name && (
                  <span className="text-[10px] font-mono-caps uppercase text-text-muted">
                    {q.categories.name}
                  </span>
                )}
              </div>
              <p className="text-sm text-text truncate">{q.prompt}</p>
            </div>
            <button
              onClick={() => handleDelete(q.id)}
              className="text-text-muted hover:text-incorrect shrink-0"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
