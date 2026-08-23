import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ListChecks, PlayCircle, FolderOpen } from "lucide-react";

export default async function HostDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ count: questionCount }, { count: sessionCount }, { data: sessions }] =
    await Promise.all([
      supabase
        .from("questions")
        .select("id", { count: "exact", head: true })
        .eq("host_id", user!.id),
      supabase
        .from("quiz_sessions")
        .select("id", { count: "exact", head: true })
        .eq("host_id", user!.id)
        .neq("status", "completed"),
      supabase
        .from("quiz_sessions")
        .select("id, name, code, status")
        .eq("host_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text">Dashboard</h1>
      <p className="text-sm text-text-muted mt-1">
        Overview of your questions and sessions.
      </p>

      <div className="grid gap-4 sm:grid-cols-3 mt-6">
        <div className="rounded-xl bg-surface border border-disabled p-5">
          <div className="text-sm text-text-muted">Active Sessions</div>
          <div className="text-3xl font-bold text-primary mt-1">
            {sessionCount ?? 0}
          </div>
        </div>
        <div className="rounded-xl bg-surface border border-disabled p-5">
          <div className="text-sm text-text-muted">Questions in Bank</div>
          <div className="text-3xl font-bold text-secondary mt-1">
            {questionCount ?? 0}
          </div>
        </div>
        <div className="rounded-xl bg-surface border border-disabled p-5">
          <div className="text-sm text-text-muted">Quick Actions</div>
          <div className="flex flex-col gap-1 mt-2">
            <Link
              href="/host/questions"
              className="text-sm text-primary hover:underline flex items-center gap-1.5"
            >
              <ListChecks size={14} /> Add a question
            </Link>
            <Link
              href="/host/sessions"
              className="text-sm text-primary hover:underline flex items-center gap-1.5"
            >
              <PlayCircle size={14} /> Start a session
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-text">Recent Sessions</h2>
          <Link
            href="/host/sessions"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {sessions && sessions.length > 0 ? (
          <div className="flex flex-col gap-2">
            {sessions.map((s) => (
              <Link
                key={s.id}
                href={`/host/sessions/${s.id}`}
                className="rounded-xl bg-surface border border-disabled p-4 flex items-center justify-between hover:border-primary transition-colors"
              >
                <div>
                  <p className="font-semibold text-text">{s.name}</p>
                  <p className="text-xs text-text-muted font-mono-caps">
                    #{s.code}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-mono-caps uppercase ${
                    s.status === "active"
                      ? "bg-correct/10 text-correct"
                      : s.status === "completed"
                        ? "bg-disabled/30 text-text-muted"
                        : "bg-warning/10 text-warning"
                  }`}
                >
                  {s.status}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-disabled p-8 text-center text-text-muted flex flex-col items-center gap-2">
            <FolderOpen size={28} />
            <p className="text-sm">
              No sessions yet. Add some questions, then start one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
