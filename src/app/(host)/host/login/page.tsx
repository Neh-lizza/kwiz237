export default function HostLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-sm bg-surface border border-disabled rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-text">Host Login</h1>
        <p className="text-sm text-text-muted mt-1">
          Sign in to manage your quiz sessions.
        </p>

        <form className="mt-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg border border-disabled px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-disabled px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-primary text-white font-semibold py-2.5 hover:opacity-90 transition-opacity"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
