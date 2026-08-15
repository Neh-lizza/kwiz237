import { Sparkles } from "lucide-react";

export default function DisplayHeader({
  sessionCode,
}: {
  sessionCode: string;
}) {
  return (
    <header className="fixed top-0 w-full z-50 bg-display-bg/90 backdrop-blur-md shadow-xl">
      <div className="h-20 max-w-6xl mx-auto px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary" size={32} />
          <span className="font-display font-bold text-3xl tracking-tight text-display-text">
            Kwiz<span className="text-primary">237</span>
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono-caps text-[11px] text-display-text/60 uppercase">
            Live Session
          </span>
          <span className="font-display font-bold text-lg text-display-text">
            #{sessionCode}
          </span>
        </div>
      </div>
    </header>
  );
}
