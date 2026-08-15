import Link from "next/link";

const stages = [
  { href: "/display/waiting", label: "Waiting Lobby" },
  { href: "/display/question", label: "Active Question" },
  { href: "/display/results", label: "Question Results" },
  { href: "/display/leaderboard", label: "Final Leaderboard" },
];

export default function DisplayIndexPage() {
  return (
    <div className="min-h-screen bg-display-bg text-display-text flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="font-display font-bold text-2xl">
        Public Display &mdash; preview
      </h1>
      <p className="text-display-text/60 text-sm text-center max-w-sm">
        These four screens represent the different stages the projector
        shows during a live session.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {stages.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="text-center bg-white/5 hover:bg-white/10 rounded-xl py-3 transition-colors border border-white/10"
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
