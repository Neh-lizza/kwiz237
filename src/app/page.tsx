export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">Kwiz237</h1>
        <p className="text-text-muted mt-2">
          Live, host-controlled quiz competitions for in-person events.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 w-full max-w-3xl">
        <a
          href="/host/login"
          className="rounded-xl bg-surface border border-disabled p-6 text-center hover:border-primary transition-colors"
        >
          <div className="text-lg font-semibold text-primary">Host</div>
          <div className="text-sm text-text-muted mt-1">
            Run and control a session
          </div>
        </a>

        <a
          href="/join"
          className="rounded-xl bg-surface border border-disabled p-6 text-center hover:border-secondary transition-colors"
        >
          <div className="text-lg font-semibold text-secondary">Player</div>
          <div className="text-sm text-text-muted mt-1">
            Join a session and play
          </div>
        </a>

        <a
          href="/display"
          className="rounded-xl bg-surface border border-disabled p-6 text-center hover:border-option-c transition-colors"
        >
          <div className="text-lg font-semibold text-option-c">Display</div>
          <div className="text-sm text-text-muted mt-1">
            Show on the projector/TV
          </div>
        </a>
      </div>
    </div>
  );
}
