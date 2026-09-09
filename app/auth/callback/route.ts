import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("from") || requestUrl.searchParams.get("next") || "/";
  const errorDescription = requestUrl.searchParams.get("error_description") || requestUrl.searchParams.get("error");

  if (errorDescription) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription)}`, request.url)
    );
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data?.session) {
        const destination = next.startsWith("/") && next !== "/login" ? next : "/";
        const forwardedHost = request.headers.get("x-forwarded-host");
        const appBase =
          process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
          (forwardedHost ? `https://${forwardedHost}` : request.nextUrl.origin) ||
          "http://localhost:3000";

        const redirectResponse = NextResponse.redirect(new URL(destination, appBase));

        // Set auth_token cookie for client-side and proxy compatibility
        redirectResponse.cookies.set("auth_token", data.session.access_token, {
          path: "/",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          secure: process.env.NODE_ENV === "production",
        });

        return redirectResponse;
      }

      if (error) {
        console.error("[auth/callback] Supabase exchangeCodeForSession error:", error.message);
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Auth callback exchange failed";
      console.error("[auth/callback] Exception exchanging code for session:", message);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(message)}`, request.url)
      );
    }
  }

  // If code is missing or exchange failed, redirect to login with error indicator
  return NextResponse.redirect(new URL("/login?error=auth_callback_failed", request.url));
}

