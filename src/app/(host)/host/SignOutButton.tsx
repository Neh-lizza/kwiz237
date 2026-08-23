"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/host/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 text-sm text-text-muted hover:text-incorrect transition-colors px-3 py-2 rounded-lg hover:bg-incorrect/10 w-full"
    >
      <LogOut size={16} />
      Sign Out
    </button>
  );
}
