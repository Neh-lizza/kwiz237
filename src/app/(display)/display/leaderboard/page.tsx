import { Trophy, PartyPopper } from "lucide-react";
import DisplayHeader from "@/components/DisplayHeader";

const rest = [
  { rank: 2, name: "QuizMaster99", score: "11,200" },
  { rank: 3, name: "TriviaNinja", score: "10,450" },
  { rank: 4, name: "FactChecker", score: "9,870" },
  { rank: 5, name: "LuckyGuess", score: "9,120" },
];

export default function FinalLeaderboardDisplayPage() {
  return (
    <div className="min-h-screen bg-display-bg text-display-text flex flex-col">
      <DisplayHeader sessionCode="QL-8829" />
      <main className="flex-1 pt-32 pb-16 px-8 max-w-4xl mx-auto w-full flex flex-col items-center">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center bg-white/5 rounded-full px-4 py-2 mb-4 border border-white/10">
            <Trophy className="text-option-d mr-2" size={20} />
            <span className="font-mono-caps text-[11px] tracking-widest">
              FINAL RESULTS
            </span>
          </div>
          <h1 className="font-display font-extrabold text-4xl flex items-center gap-2">
            Quiz Complete!
            <PartyPopper className="text-secondary" size={32} />
          </h1>
          <p className="text-display-text/70 mt-2 max-w-xl">
            The points have been tallied and the final rankings are in.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <div className="relative w-full bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full relative shrink-0">
                  <span className="font-display font-bold text-2xl text-primary">
                    1
                  </span>
                  <Trophy
                    className="absolute -bottom-1 -right-1 text-option-d bg-display-bg rounded-full p-1"
                    size={26}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono-caps text-[11px] opacity-90">
                    CHAMPION
                  </span>
                  <span className="font-display font-extrabold text-3xl">
                    Sarah_M
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono-caps text-[11px] opacity-90">
                  FINAL SCORE
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-extrabold text-3xl">
                    12,450
                  </span>
                  <span className="opacity-80 text-sm">pts</span>
                </div>
              </div>
            </div>
          </div>

          {rest.map((p) => (
            <div
              key={p.rank}
              className="flex items-center justify-between bg-white/5 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 flex items-center justify-center bg-white/10 rounded-full shrink-0">
                  <span className="font-display font-bold">{p.rank}</span>
                </div>
                <span className="font-semibold text-lg">{p.name}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-lg text-option-c">
                  {p.score}
                </span>
                <span className="text-sm opacity-60">pts</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
