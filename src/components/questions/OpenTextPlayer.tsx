"use client";

import { useState } from "react";

export default function OpenTextPlayer({
  maxLength,
  onAnswer,
  disabled = false,
}: {
  maxLength?: number;
  onAnswer?: (value: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!text.trim() || submitted || disabled) return;
    setSubmitted(true);
    onAnswer?.(text.trim());
  }

  return (
    <div className="flex flex-col gap-3">
      <textarea
        maxLength={maxLength}
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={submitted || disabled}
        className="w-full rounded-xl border border-disabled p-4 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
        placeholder="Type your answer..."
      />
      <button
        onClick={handleSubmit}
        disabled={submitted || disabled || !text.trim()}
        className="bg-primary text-white rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {submitted ? "Submitted" : "Submit"}
      </button>
    </div>
  );
}
