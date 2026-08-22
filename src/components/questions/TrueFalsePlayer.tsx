"use client";

import { useState } from "react";

export default function TrueFalsePlayer({
  onAnswer,
  disabled = false,
}: {
  onAnswer?: (value: boolean) => void;
  disabled?: boolean;
}) {
  const [selected, setSelected] = useState<boolean | null>(null);

  function handleClick(value: boolean) {
    if (selected !== null || disabled) return;
    setSelected(value);
    onAnswer?.(value);
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        disabled={selected !== null || disabled}
        onClick={() => handleClick(true)}
        className={`bg-primary text-white rounded-xl py-8 font-bold text-xl hover:opacity-90 transition-opacity ${
          selected === true ? "ring-4 ring-white/60" : ""
        } ${selected === false ? "opacity-40" : ""}`}
      >
        True
      </button>
      <button
        disabled={selected !== null || disabled}
        onClick={() => handleClick(false)}
        className={`bg-secondary text-white rounded-xl py-8 font-bold text-xl hover:opacity-90 transition-opacity ${
          selected === false ? "ring-4 ring-white/60" : ""
        } ${selected === true ? "opacity-40" : ""}`}
      >
        False
      </button>
    </div>
  );
}
