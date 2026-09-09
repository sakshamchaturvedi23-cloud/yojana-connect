import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider") as "google" | "github";
  const from = searchParams.get("from") || searchParams.get("next") || "/";
  const wantsJson = request.headers.get("accept")?.includes("application/json") || searchParams.get("json") === "true";

  if (!provider || (provider !== "google" && provider !== "github")) {
    if (wantsJson) {
      return NextResponse.json(
        { success: false, error: "Invalid OAuth provider. Supported: google, github." },
        { status: 400 }
      );
    }
    return NextResponse.redirect(new URL("/login?error=invalid_provider", request.url));
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (request.headers.get("x-forwarded-host")
      ? `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("x-forwarded-host")}`
      : request.nextUrl.origin) ||
    "http://localhost:3000";

  const redirectTo = `${origin}/auth/callback?from=${encodeURIComponent(from)}`;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error(`[OAuth API] Failed to start OAuth for ${provider}:`, error.message);
      if (wantsJson) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
      );
    }

    if (data?.url) {
      if (wantsJson) {
        return NextResponse.json({ success: true, url: data.url });
      }
      return NextResponse.redirect(data.url);
    }

    const fallbackError = `No authorization URL returned for ${provider}.`;
    if (wantsJson) {
      return NextResponse.json({ success: false, error: fallbackError }, { status: 500 });
    }
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(fallbackError)}`, request.url)
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error initializing OAuth";
    console.error(`[OAuth API] Exception starting OAuth for ${provider}:`, message);

    if (wantsJson) {
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(message)}`, request.url)
    );
  }
}

