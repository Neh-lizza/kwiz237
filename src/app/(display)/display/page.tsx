const options = [
  { label: "A", color: "bg-option-a", text: "Douala" },
  { label: "B", color: "bg-option-b", text: "Yaoundé" },
  { label: "C", color: "bg-option-c", text: "Buea" },
  { label: "D", color: "bg-option-d", text: "Bamenda" },
];

export default function DisplayPage() {
  return (
    <div className="min-h-screen bg-display-bg text-display-text flex flex-col items-center justify-center p-10 gap-10">
      <div className="text-warning text-3xl font-bold">00:12</div>

      <h1 className="text-5xl font-bold text-center max-w-4xl">
        What is the capital of Cameroon?
      </h1>

      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
        {options.map((opt) => (
          <div
            key={opt.label}
            className={`${opt.color} rounded-2xl py-8 px-6 text-3xl font-semibold text-white flex items-center gap-4`}
          >
            <span className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">
              {opt.label}
            </span>
            {opt.text}
          </div>
        ))}
      </div>
    </div>
  );
}
