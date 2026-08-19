import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";

const navItems = [
  "Dashboard",
  "Events",
  "Sessions",
  "Question Bank",
  "Categories",
  "Players",
  "Results",
  "Reports",
  "Settings",
];

export default async function HostDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already redirects unauthenticated
  // requests, but this keeps the page safe even if middleware config
  // ever changes.
  if (!user) {
    redirect("/host/login");
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-surface border-r border-disabled p-4 hidden sm:flex sm:flex-col">
        <div className="text-primary font-bold text-lg mb-6">Kwiz237</div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item, i) => (
            <a
              key={item}
              href="#"
              className={`text-sm rounded-lg px-3 py-2 ${
                i === 0
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text-muted hover:bg-background"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="border-t border-disabled pt-3 flex flex-col gap-1">
          <p className="text-xs text-text-muted px-3 truncate">
            {user.email}
          </p>
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">
          Overview of your events and sessions.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <div className="rounded-xl bg-surface border border-disabled p-5">
            <div className="text-sm text-text-muted">Active Sessions</div>
            <div className="text-3xl font-bold text-primary mt-1">0</div>
          </div>
          <div className="rounded-xl bg-surface border border-disabled p-5">
            <div className="text-sm text-text-muted">Questions in Bank</div>
            <div className="text-3xl font-bold text-secondary mt-1">0</div>
          </div>
          <div className="rounded-xl bg-surface border border-disabled p-5">
            <div className="text-sm text-text-muted">Events</div>
            <div className="text-3xl font-bold text-option-c mt-1">0</div>
          </div>
        </div>
      </main>
    </div>
  );
}
