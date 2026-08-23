"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { QuestionType } from "@/types/question";

interface Category {
  id: string;
  name: string;
}

const TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: "Multiple Choice",
  true_false: "True / False",
  open_text: "Open Text",
  word_cloud: "Word Cloud",
  rating_scale: "Rating Scale",
  ranking: "Ranking",
  image_choice: "Image Choice",
};

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuestionForm({
  categories,
  onCreated,
}: {
  categories: Category[];
  onCreated: () => void;
}) {
  const [type, setType] = useState<QuestionType>("multiple_choice");
  const [prompt, setPrompt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(20);
  const [points, setPoints] = useState(100);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // multiple_choice / image_choice
  const [options, setOptions] = useState(["", "", "", ""]);
  const [optionImages, setOptionImages] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  // true_false
  const [correctBool, setCorrectBool] = useState(true);

  // open_text
  const [acceptedAnswers, setAcceptedAnswers] = useState("");
  const [maxLength, setMaxLength] = useState(200);

  // word_cloud
  const [maxWords, setMaxWords] = useState(1);

  // rating_scale
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(5);
  const [minLabel, setMinLabel] = useState("");
  const [maxLabel, setMaxLabel] = useState("");

  // ranking
  const [rankItems, setRankItems] = useState(["", "", ""]);

  function resetTypeFields() {
    setOptions(["", "", "", ""]);
    setOptionImages(["", "", "", ""]);
    setCorrectIndex(0);
    setCorrectBool(true);
    setAcceptedAnswers("");
    setRankItems(["", "", ""]);
  }

  function buildConfig(): Record<string, unknown> | null {
    if (type === "multiple_choice") {
      const opts = options
        .map((text, i) => ({ id: String.fromCharCode(97 + i), label: OPTION_LABELS[i], text }))
        .filter((o) => o.text.trim());
      if (opts.length < 2) return null;
      return { options: opts, correctOptionId: opts[correctIndex]?.id ?? opts[0].id };
    }
    if (type === "image_choice") {
      const opts = options
        .map((text, i) => ({
          id: String.fromCharCode(97 + i),
          label: text || OPTION_LABELS[i],
          imageUrl: optionImages[i],
        }))
        .filter((o) => o.imageUrl.trim());
      if (opts.length < 2) return null;
      return { options: opts, correctOptionId: opts[correctIndex]?.id ?? opts[0].id };
    }
    if (type === "true_false") {
      return { correctAnswer: correctBool };
    }
    if (type === "open_text") {
      const accepted = acceptedAnswers
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
      return {
        acceptedAnswers: accepted.length > 0 ? accepted : undefined,
        maxLength,
      };
    }
    if (type === "word_cloud") {
      return { maxWordsPerPlayer: maxWords };
    }
    if (type === "rating_scale") {
      return {
        min,
        max,
        minLabel: minLabel || undefined,
        maxLabel: maxLabel || undefined,
      };
    }
    if (type === "ranking") {
      const items = rankItems
        .map((label, i) => ({ id: `i${i}`, label }))
        .filter((i) => i.label.trim());
      if (items.length < 2) return null;
      return { items, correctOrder: items.map((i) => i.id) };
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!prompt.trim()) {
      setError("Question prompt is required");
      return;
    }
    const config = buildConfig();
    if (!config) {
      setError("Fill in at least two options/items for this question type");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        prompt: prompt.trim(),
        categoryId: categoryId || undefined,
        timeLimitSeconds,
        points,
        config,
      }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Could not create question");
      return;
    }

    setPrompt("");
    resetTypeFields();
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-disabled rounded-xl p-5 flex flex-col gap-4 max-w-2xl"
    >
      <div className="flex flex-wrap gap-2">
        {(Object.keys(TYPE_LABELS) as QuestionType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setType(t);
              resetTypeFields();
            }}
            className={`text-xs px-3 py-1.5 rounded-full border ${
              type === t
                ? "bg-primary text-white border-primary"
                : "border-disabled text-text-muted"
            }`}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">
          Question prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-disabled px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="What is the capital of Cameroon?"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border border-disabled px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Time limit (sec)
          </label>
          <input
            type="number"
            value={timeLimitSeconds}
            onChange={(e) => setTimeLimitSeconds(Number(e.target.value))}
            className="w-full rounded-lg border border-disabled px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Points
          </label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="w-full rounded-lg border border-disabled px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* --- Type-specific fields --- */}
      {(type === "multiple_choice" || type === "image_choice") && (
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-text">
            Options{" "}
            <span className="text-text-muted font-normal">
              (select the correct one)
            </span>
          </label>
          {options.map((val, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="correctOption"
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
                className="shrink-0"
              />
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                  ["bg-option-a", "bg-option-b", "bg-option-c", "bg-option-d"][i]
                }`}
              >
                {OPTION_LABELS[i]}
              </span>
              {type === "multiple_choice" ? (
                <input
                  value={val}
                  onChange={(e) => {
                    const next = [...options];
                    next[i] = e.target.value;
                    setOptions(next);
                  }}
                  placeholder={`Option ${OPTION_LABELS[i]}`}
                  className="flex-1 rounded-lg border border-disabled px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <>
                  <input
                    value={val}
                    onChange={(e) => {
                      const next = [...options];
                      next[i] = e.target.value;
                      setOptions(next);
                    }}
                    placeholder="Label (optional)"
                    className="w-32 rounded-lg border border-disabled px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    value={optionImages[i]}
                    onChange={(e) => {
                      const next = [...optionImages];
                      next[i] = e.target.value;
                      setOptionImages(next);
                    }}
                    placeholder="Image URL"
                    className="flex-1 rounded-lg border border-disabled px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {type === "true_false" && (
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Correct answer
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCorrectBool(true)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                correctBool
                  ? "bg-correct text-white"
                  : "bg-background text-text-muted"
              }`}
            >
              True
            </button>
            <button
              type="button"
              onClick={() => setCorrectBool(false)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                !correctBool
                  ? "bg-incorrect text-white"
                  : "bg-background text-text-muted"
              }`}
            >
              False
            </button>
          </div>
        </div>
      )}

      {type === "open_text" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs text-text-muted mb-1">
              Accepted answers (comma-separated, optional - leave blank for
              ungraded)
            </label>
            <input
              value={acceptedAnswers}
              onChange={(e) => setAcceptedAnswers(e.target.value)}
              placeholder="Yaoundé, yaounde"
              className="w-full rounded-lg border border-disabled px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">
              Max length
            </label>
            <input
              type="number"
              value={maxLength}
              onChange={(e) => setMaxLength(Number(e.target.value))}
              className="w-full rounded-lg border border-disabled px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {type === "word_cloud" && (
        <div>
          <label className="block text-xs text-text-muted mb-1">
            Max words per player
          </label>
          <input
            type="number"
            value={maxWords}
            onChange={(e) => setMaxWords(Number(e.target.value))}
            className="w-32 rounded-lg border border-disabled px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {type === "rating_scale" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-text-muted mb-1">Min</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="w-full rounded-lg border border-disabled px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Max</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="w-full rounded-lg border border-disabled px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">
              Min label
            </label>
            <input
              value={minLabel}
              onChange={(e) => setMinLabel(e.target.value)}
              placeholder="Very easy"
              className="w-full rounded-lg border border-disabled px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">
              Max label
            </label>
            <input
              value={maxLabel}
              onChange={(e) => setMaxLabel(e.target.value)}
              placeholder="Very hard"
              className="w-full rounded-lg border border-disabled px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {type === "ranking" && (
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-text">
            Items, in the correct order
          </label>
          {rankItems.map((val, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 text-sm text-text-muted shrink-0">
                {i + 1}.
              </span>
              <input
                value={val}
                onChange={(e) => {
                  const next = [...rankItems];
                  next[i] = e.target.value;
                  setRankItems(next);
                }}
                className="flex-1 rounded-lg border border-disabled px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {rankItems.length > 2 && (
                <button
                  type="button"
                  onClick={() =>
                    setRankItems(rankItems.filter((_, idx) => idx !== i))
                  }
                  className="text-text-muted hover:text-incorrect"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setRankItems([...rankItems, ""])}
            className="text-sm text-primary hover:underline flex items-center gap-1 self-start"
          >
            <Plus size={14} /> Add item
          </button>
        </div>
      )}

      {error && <p className="text-sm text-incorrect">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-primary text-white rounded-lg py-2.5 font-semibold disabled:opacity-50 self-start px-6"
      >
        {submitting ? "Saving..." : "Add Question"}
      </button>
    </form>
  );
}
