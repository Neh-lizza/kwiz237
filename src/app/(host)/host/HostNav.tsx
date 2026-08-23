"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";

const navItems = [
  { label: "Dashboard", href: "/host/dashboard" },
  { label: "Sessions", href: "/host/sessions" },
  { label: "Question Bank", href: "/host/questions" },
  { label: "Categories", href: "/host/categories" },
];

export default function HostNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-surface border-r border-disabled p-4 hidden sm:flex sm:flex-col shrink-0">
      <div className="text-primary font-bold text-lg mb-6">Kwiz237</div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm rounded-lg px-3 py-2 ${
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text-muted hover:bg-background"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-disabled pt-3 flex flex-col gap-1">
        <p className="text-xs text-text-muted px-3 truncate">{userEmail}</p>
        <SignOutButton />
      </div>
    </aside>
  );
}
