import { Zap, User } from "lucide-react";

export default function PlayerHeader({ status }: { status: string }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-disabled/60">
      <div className="h-16 px-5 flex items-center justify-between max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Zap className="text-primary" size={26} fill="currentColor" />
          <h1 className="font-display font-bold text-lg tracking-tight text-primary">
            Kwiz237
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block font-mono-caps text-[11px] text-text-muted uppercase">
            {status}
          </span>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="text-white" size={16} />
          </div>
        </div>
      </div>
    </header>
  );
}
