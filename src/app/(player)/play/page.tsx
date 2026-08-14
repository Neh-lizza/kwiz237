const options = [
  { label: "A", color: "bg-option-a", text: "Douala" },
  { label: "B", color: "bg-option-b", text: "Yaoundé" },
  { label: "C", color: "bg-option-c", text: "Buea" },
  { label: "D", color: "bg-option-d", text: "Bamenda" },
];

export default function PlayPage() {
  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>Question 3 of 10</span>
        <span className="text-warning font-semibold">00:12</span>
      </div>

      <h1 className="text-xl font-bold text-text mt-6 mb-8">
        What is the capital of Cameroon?
      </h1>

      <div className="grid grid-cols-1 gap-3 mt-auto">
        {options.map((opt) => (
          <button
            key={opt.label}
            className={`${opt.color} text-white rounded-xl py-5 px-4 flex items-center gap-3 font-semibold text-left hover:opacity-90 transition-opacity`}
          >
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
              {opt.label}
            </span>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
