export default function JoinPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-surface border border-disabled rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-text text-center">
          Join a Session
        </h1>
        <p className="text-sm text-text-muted text-center mt-1">
          Enter the session code from the host.
        </p>

        <form className="mt-6 flex flex-col gap-4">
          <input
            type="text"
            maxLength={6}
            className="w-full text-center text-2xl tracking-widest uppercase rounded-lg border border-disabled px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="CODE"
          />
          <input
            type="text"
            className="w-full rounded-lg border border-disabled px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="Your nickname"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary text-white font-semibold py-3 hover:opacity-90 transition-opacity"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
