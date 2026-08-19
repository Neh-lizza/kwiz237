import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs on every request. Refreshes the Supabase auth session, then
 * gates any /host route (except /host/login) behind a logged-in user.
 * This is the actual enforcement layer - a hidden button isn't
 * security, this middleware check is.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isHostRoute = request.nextUrl.pathname.startsWith("/host");
  const isLoginRoute = request.nextUrl.pathname === "/host/login";

  if (isHostRoute && !isLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/host/login";
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/host/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
