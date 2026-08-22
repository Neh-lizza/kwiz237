"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { MultipleChoiceQuestion } from "@/types/question";

const optionColors = [
  "bg-option-a",
  "bg-option-b",
  "bg-option-c",
  "bg-option-d",
];

export default function MultipleChoicePlayer({
  question,
  onAnswer,
  disabled = false,
}: {
  question: MultipleChoiceQuestion;
  /** Called with the chosen option's id. If omitted, this behaves as
   * a local-only preview (used by the /play demo switcher). */
  onAnswer?: (optionId: string) => void;
  /** True once an answer has already been submitted - locks the UI. */
  disabled?: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleClick(optionId: string) {
    if (selected !== null || disabled) return;
    setSelected(optionId);
    onAnswer?.(optionId);
  }

  return (
    <div className="flex flex-col gap-3">
      {question.options.map((opt, i) => {
        const isSelected = selected === opt.id;
        const isDimmed = (selected !== null || disabled) && !isSelected;
        return (
          <button
            key={opt.id}
            disabled={selected !== null || disabled}
            onClick={() => handleClick(opt.id)}
            className={`${optionColors[i % optionColors.length]} relative overflow-hidden rounded-xl min-h-[64px] flex items-stretch text-left text-white shadow-sm transition-all active:scale-[0.98] ${
              isDimmed ? "opacity-40 scale-[0.98]" : ""
            } ${isSelected ? "ring-4 ring-white/60" : ""}`}
          >
            <div className="w-16 flex items-center justify-center bg-black/20 shrink-0">
              <span className="font-display font-bold text-xl opacity-90">
                {opt.label}
              </span>
            </div>
            <div className="flex-1 px-4 flex items-center justify-between gap-2">
              <span className="font-display font-semibold">{opt.text}</span>
              {isSelected && <Check size={20} />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
