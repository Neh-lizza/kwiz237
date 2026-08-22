"use client";

import { useState } from "react";

export default function WordCloudPlayer({
  maxWordsPerPlayer = 1,
  onAnswer,
  disabled = false,
}: {
  maxWordsPerPlayer?: number;
  onAnswer?: (value: string) => void;
  disabled?: boolean;
}) {
  const [word, setWord] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!word.trim() || submitted || disabled) return;
    setSubmitted(true);
    onAnswer?.(word.trim());
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        value={word}
        onChange={(e) => setWord(e.target.value)}
        disabled={submitted || disabled}
        className="w-full rounded-xl border border-disabled p-4 text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
        placeholder="Enter a word or short phrase"
      />
      <p className="text-sm text-text-muted text-center">
        Up to {maxWordsPerPlayer} word{maxWordsPerPlayer > 1 ? "s" : ""}
      </p>
      <button
        onClick={handleSubmit}
        disabled={submitted || disabled || !word.trim()}
        className="bg-primary text-white rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {submitted ? "Submitted" : "Submit"}
      </button>
    </div>
  );
}
