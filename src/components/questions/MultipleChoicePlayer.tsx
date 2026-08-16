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
}: {
  question: MultipleChoiceQuestion;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {question.options.map((opt, i) => {
        const isSelected = selected === opt.id;
        const isDimmed = selected !== null && !isSelected;
        return (
          <button
            key={opt.id}
            disabled={selected !== null}
            onClick={() => setSelected(opt.id)}
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
