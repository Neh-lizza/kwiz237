import { CheckCircle2 } from "lucide-react";
import DisplayHeader from "@/components/DisplayHeader";

const results = [
  { label: "A", text: "1969", pct: 71, count: 28, correct: true },
  { label: "B", text: "1968", pct: 13, count: 5, correct: false },
  { label: "C", text: "1970", pct: 10, count: 4, correct: false },
  { label: "D", text: "1971", pct: 6, count: 2, correct: false },
];

export default function QuestionResultsDisplayPage() {
  return (
    <div className="min-h-screen bg-display-bg text-display-text flex flex-col">
      <DisplayHeader sessionCode="QL-8829" />
      <main className="flex-1 pt-32 pb-16 px-8 flex flex-col items-center max-w-5xl mx-auto w-full gap-10">
        <div className="text-center max-w-3xl">
          <span className="inline-flex px-3 py-1.5 rounded-full bg-white/10 font-mono-caps text-[11px] tracking-widest uppercase mb-4">
            Question 4 Result
          </span>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl leading-tight">
            In what year did the Apollo 11 mission successfully land the
            first humans on the Moon?
          </h1>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-3 justify-center">
            {results.map((r) =>
              r.correct ? (
                <div
                  key={r.label}
                  className="relative bg-correct rounded-xl p-6 shadow-xl flex items-center gap-4 overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-lg bg-white/20 flex items-center justify-center shrink-0 font-display font-bold text-2xl">
                    {r.label}
                  </div>
                  <span className="font-semibold text-2xl">{r.text}</span>
                  <CheckCircle2 className="ml-auto" size={32} />
                </div>
              ) : (
                <div
                  key={r.label}
                  className="bg-white/5 rounded-xl p-4 flex items-center gap-4 opacity-50"
                >
                  <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0 font-display font-bold">
                    {r.label}
                  </div>
                  <span className="font-medium text-lg">{r.text}</span>
                </div>
              ),
            )}
          </div>

          <div className="flex flex-col justify-center gap-5">
            <div className="flex items-end justify-between">
              <h2 className="font-display font-bold text-xl">
                Audience Answers
              </h2>
              <span className="font-mono-caps text-[11px] text-display-text/60 uppercase">
                39 Total Responses
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {results.map((r) => (
                <div key={r.label} className="flex items-center gap-3">
                  <div
                    className={`w-7 font-display font-bold ${r.correct ? "text-correct" : "text-display-text/50"}`}
                  >
                    {r.label}
                  </div>
                  <div className="flex-1 h-8 bg-white/10 rounded-r-full overflow-hidden">
                    <div
                      className={`h-full rounded-r-full flex items-center px-3 ${r.correct ? "bg-correct" : "bg-white/20"}`}
                      style={{ width: `${r.pct}%` }}
                    >
                      <span className="text-xs font-mono-caps">{r.pct}%</span>
                    </div>
                  </div>
                  <div className="w-8 text-right font-display font-bold">
                    {r.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
