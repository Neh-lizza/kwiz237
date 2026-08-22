"use client";

import { useState } from "react";

export default function ImageChoicePlayer({
  options,
  onAnswer,
  disabled = false,
}: {
  options: { id: string; label: string; imageUrl: string }[];
  onAnswer?: (optionId: string) => void;
  disabled?: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleClick(id: string) {
    if (selected !== null || disabled) return;
    setSelected(id);
    onAnswer?.(id);
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => (
        <button
          key={opt.id}
          disabled={selected !== null || disabled}
          onClick={() => handleClick(opt.id)}
          className={`rounded-xl overflow-hidden border-2 transition-colors bg-surface ${
            selected === opt.id ? "border-primary" : "border-disabled"
          } ${selected !== null && selected !== opt.id ? "opacity-40" : ""}`}
        >
          <div
            className="w-full aspect-square bg-cover bg-center bg-disabled/40"
            style={{ backgroundImage: `url(${opt.imageUrl})` }}
          />
          <div className="p-2 text-sm font-medium">{opt.label}</div>
        </button>
      ))}
    </div>
  );
}
