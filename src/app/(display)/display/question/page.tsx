import DisplayHeader from "@/components/DisplayHeader";
import CountdownTimer from "@/components/CountdownTimer";

const options = [
  { label: "A", color: "bg-option-a", text: "1965" },
  { label: "B", color: "bg-option-b", text: "1969" },
  { label: "C", color: "bg-option-c", text: "1971" },
  { label: "D", color: "bg-option-d", text: "1973" },
];

export default function ActiveQuestionDisplayPage() {
  return (
    <div className="min-h-screen bg-display-bg text-display-text flex flex-col">
      <DisplayHeader sessionCode="QL-8829" />
      <main className="flex-1 pt-32 pb-16 px-8 flex flex-col items-center max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between w-full mb-10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-white/10 rounded-full font-mono-caps text-[11px] tracking-widest">
              QUESTION 4 OF 10
            </span>
            <span className="px-3 py-1.5 bg-secondary/20 rounded-full font-mono-caps text-[11px] tracking-widest">
              CATEGORY: HISTORY
            </span>
          </div>
          <CountdownTimer seconds={20} size={110} />
        </div>

        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-center leading-tight mb-12 max-w-4xl">
          In what year did the Apollo 11 spacecraft land on the moon?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {options.map((opt) => (
            <div
              key={opt.label}
              className={`${opt.color} relative overflow-hidden rounded-2xl p-6 flex items-center gap-4 shadow-lg min-h-[100px]`}
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 border-2 border-white/30 font-display font-bold text-xl">
                {opt.label}
              </div>
              <span className="font-semibold text-2xl">{opt.text}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
