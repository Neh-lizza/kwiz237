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
  return (
    <div className="grid grid-cols-1 gap-3">
      {question.options.map((opt, i) => (
        <button
          key={opt.id}
          className={`${optionColors[i % optionColors.length]} text-white rounded-xl py-5 px-4 flex items-center gap-3 font-semibold text-left hover:opacity-90 transition-opacity`}
        >
          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
            {opt.label}
          </span>
          {opt.text}
        </button>
      ))}
    </div>
  );
}
