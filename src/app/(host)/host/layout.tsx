import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HostNav from "./HostNav";

export default async function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The login page lives inside this same (host) route group but
  // should render standalone, without the sidebar or an auth check.
  // Middleware already keeps unauthenticated requests off every
  // other /host/* route, so reaching here with no user only happens
  // for /host/login itself.
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex">
      <HostNav userEmail={user.email ?? ""} />
      <main className="flex-1 p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
