"use client";

import { useState } from "react";

export default function RatingScalePlayer({
  min,
  max,
  minLabel,
  maxLabel,
  onAnswer,
  disabled = false,
}: {
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
  onAnswer?: (value: number) => void;
  disabled?: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  function handleClick(v: number) {
    if (selected !== null || disabled) return;
    setSelected(v);
    onAnswer?.(v);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between text-sm text-text-muted">
        <span>{minLabel ?? min}</span>
        <span>{maxLabel ?? max}</span>
      </div>
      <div className="flex gap-2 justify-between">
        {values.map((v) => (
          <button
            key={v}
            disabled={selected !== null || disabled}
            onClick={() => handleClick(v)}
            className={`flex-1 aspect-square rounded-lg border font-semibold transition-colors ${
              selected === v
                ? "bg-primary text-white border-primary"
                : "bg-surface border-disabled hover:border-primary hover:text-primary"
            } ${selected !== null && selected !== v ? "opacity-40" : ""}`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
