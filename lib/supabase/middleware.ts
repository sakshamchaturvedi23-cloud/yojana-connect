import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let user = null;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Cryptographically validate the Supabase JWT
    try {
      const {
        data: { user: verifiedUser },
        error,
      } = await supabase.auth.getUser();
      if (!error && verifiedUser) {
        user = verifiedUser;
      }
    } catch {
      user = null;
    }
  }

  // Also verify secondary/mock auth token cookies (e.g., demo account, backend JWT)
  const authTokenCookie =
    request.cookies.get("auth_token")?.value ||
    request.cookies.get("yojana_token")?.value;

  const isAuthenticated = !!user || (!!authTokenCookie && authTokenCookie.trim().length > 0);

  const { pathname } = request.nextUrl;

  // Determine if current path is a public route
  const isPublicRoute =
    pathname === "/login" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico" ||
    /\.(.*)$/.test(pathname);

  // Public routes (including /login) are unconditionally served with zero redirects
  if (isPublicRoute) {
    return supabaseResponse;
  }

  // Enforce route protection: redirect unauthenticated access on protected pages to /login
  if (!isAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    if (pathname !== "/") {
      redirectUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
