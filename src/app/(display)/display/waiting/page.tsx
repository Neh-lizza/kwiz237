import { Star, Users } from "lucide-react";
import DisplayHeader from "@/components/DisplayHeader";

const codeLetters = ["Q", "W", "E", "R", "T"];

export default function WaitingLobbyDisplayPage() {
  return (
    <div className="min-h-screen bg-display-bg text-display-text flex flex-col">
      <DisplayHeader sessionCode="QL-8829" />
      <main className="flex-1 pt-32 pb-16 flex flex-col items-center justify-center px-8">
        <div className="bg-white/5 backdrop-blur-md rounded-full px-5 py-2 mb-10 flex items-center gap-2">
          <Star className="text-primary" size={20} fill="currentColor" />
          <h1 className="font-display font-bold text-lg">
            Weekly Trivia Night
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-4xl">
          <div className="bg-white rounded-2xl p-8 shadow-xl flex items-center justify-center aspect-square">
            <svg viewBox="0 0 100 100" className="w-full h-full text-display-bg">
              <rect x="10" y="10" width="20" height="20" fill="currentColor" />
              <rect x="70" y="10" width="20" height="20" fill="currentColor" />
              <rect x="10" y="70" width="20" height="20" fill="currentColor" />
              <rect x="15" y="15" width="10" height="10" fill="white" />
              <rect x="75" y="15" width="10" height="10" fill="white" />
              <rect x="15" y="75" width="10" height="10" fill="white" />
              <rect x="40" y="10" width="10" height="10" fill="currentColor" />
              <rect x="55" y="20" width="10" height="10" fill="currentColor" />
              <rect x="35" y="35" width="10" height="10" fill="currentColor" />
              <rect x="70" y="40" width="10" height="10" fill="currentColor" />
              <rect x="10" y="45" width="20" height="10" fill="currentColor" />
              <rect x="45" y="55" width="10" height="20" fill="currentColor" />
              <rect x="65" y="65" width="15" height="10" fill="currentColor" />
              <rect x="80" y="80" width="10" height="10" fill="currentColor" />
              <rect x="40" y="80" width="15" height="10" fill="currentColor" />
            </svg>
          </div>

          <div className="flex flex-col items-center md:items-start gap-4">
            <p className="text-2xl opacity-80">Join at</p>
            <div className="bg-primary/15 rounded-lg px-4 py-2">
              <p className="font-display font-extrabold text-3xl text-primary tracking-tight">
                kwiz237.app
              </p>
            </div>
            <p className="text-xl mt-4">Session Code:</p>
            <div className="flex gap-2">
              {codeLetters.map((l, i) => (
                <div
                  key={i}
                  className="bg-white/10 w-16 h-20 rounded-lg flex items-center justify-center shadow-md"
                >
                  <span className="font-display font-bold text-4xl">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-display-text/80">
            <Users size={20} />
            <p>
              <strong className="text-primary font-bold">12</strong> Players
              Joined
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1 opacity-60">
            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0s]" />
            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.15s]" />
            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.3s]" />
            <span className="font-mono-caps text-[11px] ml-2">
              Waiting for host to start...
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
