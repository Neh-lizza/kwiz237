"use client";

import { useState } from "react";

export default function RankingPlayer({
  items,
  onAnswer,
  disabled = false,
}: {
  items: { id: string; label: string }[];
  onAnswer?: (orderedIds: string[]) => void;
  disabled?: boolean;
}) {
  const [order, setOrder] = useState(items.map((i) => i.id));
  const [submitted, setSubmitted] = useState(false);

  function move(index: number, direction: -1 | 1) {
    if (submitted || disabled) return;
    const next = [...order];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  }

  function handleSubmit() {
    if (submitted || disabled) return;
    setSubmitted(true);
    onAnswer?.(order);
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-text-muted mb-1">
        Use the arrows to put these in the correct order
      </p>
      {order.map((id, i) => {
        const item = items.find((it) => it.id === id)!;
        return (
          <div
            key={id}
            className="bg-surface border border-disabled rounded-xl px-4 py-3 flex items-center gap-3"
          >
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
              {i + 1}
            </span>
            <span className="flex-1">{item.label}</span>
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => move(i, -1)}
                disabled={submitted || disabled || i === 0}
                className="text-text-muted disabled:opacity-30 text-xs px-1"
              >
                ▲
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={submitted || disabled || i === order.length - 1}
                className="text-text-muted disabled:opacity-30 text-xs px-1"
              >
                ▼
              </button>
            </div>
          </div>
        );
      })}
      <button
        onClick={handleSubmit}
        disabled={submitted || disabled}
        className="bg-primary text-white rounded-xl py-3 font-semibold mt-2 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {submitted ? "Submitted" : "Submit Order"}
      </button>
    </div>
  );
}
