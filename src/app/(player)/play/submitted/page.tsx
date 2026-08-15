import { Lock, Check } from "lucide-react";
import PlayerHeader from "@/components/PlayerHeader";

const options = [
  { label: "A", text: "Gone with the Wind" },
  { label: "B", text: "Citizen Kane" },
  { label: "C", text: "Casablanca" },
  { label: "D", text: "The Godfather" },
];
const selected = "C";

export default function AnswerSubmittedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PlayerHeader status="Answer locked" />
      <main className="flex-1 pt-24 px-5 pb-6 flex flex-col max-w-md mx-auto w-full">
        <div className="flex flex-col items-center text-center pb-6 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center justify-center mb-3 ring-4 ring-primary/10">
            <Lock size={28} />
          </div>
          <h2 className="font-display font-bold text-xl text-text">
            Answer Locked!
          </h2>
          <p className="text-sm text-text-muted max-w-[260px] mt-1">
            Hold tight. Waiting for the rest of the players to finish...
          </p>
        </div>

        <div className="bg-surface rounded-xl p-4 mb-6 shadow-sm opacity-90 border border-disabled/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-mono-caps text-[10px] uppercase">
              Pop Culture
            </span>
            <span className="text-text-muted font-mono-caps text-[10px]">
              Question 4 of 10
            </span>
          </div>
          <h3 className="font-semibold text-text">
            Which iconic movie features the quote, &ldquo;Here&rsquo;s
            looking at you, kid&rdquo;?
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {options.map((opt) =>
            opt.label === selected ? (
              <div
                key={opt.label}
                className="w-full rounded-xl bg-primary text-white p-4 flex items-center gap-3 shadow-lg animate-pulse"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-white/20 flex items-center justify-center font-display font-bold">
                  {opt.label}
                </div>
                <span className="flex-grow font-semibold text-left">
                  {opt.text}
                </span>
                <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Check size={16} />
                </div>
              </div>
            ) : (
              <div
                key={opt.label}
                className="w-full rounded-xl bg-surface p-4 flex items-center gap-3 opacity-40 border border-disabled/50"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-background flex items-center justify-center font-display font-bold text-text-muted">
                  {opt.label}
                </div>
                <span className="text-text">{opt.text}</span>
              </div>
            ),
          )}
        </div>

        <div className="mt-auto pt-8 bg-surface rounded-full px-3 py-2 flex items-center justify-between border border-disabled/50">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center ring-2 ring-surface text-[10px] font-bold text-secondary">
              MJ
            </div>
            <div className="w-6 h-6 rounded-full bg-option-c/20 flex items-center justify-center ring-2 ring-surface text-[10px] font-bold text-option-c">
              RK
            </div>
            <div className="w-6 h-6 rounded-full bg-incorrect/20 flex items-center justify-center ring-2 ring-surface text-[10px] font-bold text-incorrect">
              SL
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="font-mono-caps text-[10px] text-text-muted">
              3/8 Answered
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
