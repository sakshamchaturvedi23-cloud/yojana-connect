import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isSupabaseConfigured, getSupabaseServerClient } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailOrUsername, password, rememberMe, token: clientToken, user: clientUser } = body;

    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days or 1 day

    // If client already authenticated with Supabase and syncs session
    if (clientToken && clientUser) {
      const response = NextResponse.json({
        success: true,
        token: clientToken,
        user: clientUser,
        message: "Session synchronized",
      });

      response.cookies.set("auth_token", clientToken, {
        path: "/",
        sameSite: "lax",
        maxAge,
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    }

    // Field validations
    if (!emailOrUsername || typeof emailOrUsername !== "string" || !emailOrUsername.trim()) {
      return NextResponse.json(
        { success: false, error: "Please provide your email address or username." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 1. Authenticate with Supabase if configured on server
    if (isSupabaseConfigured() && emailOrUsername.includes("@")) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailOrUsername.trim().toLowerCase(),
          password,
        });

        if (!error && data.session && data.user) {
          const user = {
            id: data.user.id,
            name:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              data.user.email?.split("@")[0] ||
              "Citizen",
            email: data.user.email || emailOrUsername.trim().toLowerCase(),
          };

          const token = data.session.access_token;

          const response = NextResponse.json({
            success: true,
            token,
            user,
            message: "Authentication successful",
          });

          response.cookies.set("auth_token", token, {
            path: "/",
            sameSite: "lax",
            maxAge,
            secure: process.env.NODE_ENV === "production",
          });

          return response;
        }

        if (error) {
          return NextResponse.json(
            { success: false, error: error.message },
            { status: 401 }
          );
        }
      }
    }

    // 2. Demo invalid credentials check example
    if (password === "wrongpassword") {
      return NextResponse.json(
        { success: false, error: "Invalid credentials. Please verify your password." },
        { status: 401 }
      );
    }

    // 3. Fallback: local session creation with mock JWT token
    const user = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: emailOrUsername.includes("@")
        ? emailOrUsername.split("@")[0].replace(/[._]/g, " ")
        : emailOrUsername,
      email: emailOrUsername.includes("@")
        ? emailOrUsername
        : `${emailOrUsername}@citizen.gov.in`,
    };

    const mockToken = `jwt_mock_${Buffer.from(JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + 86400000 })).toString("base64")}`;

    const response = NextResponse.json({
      success: true,
      token: mockToken,
      user,
      message: "Authentication successful",
    });

    response.cookies.set("auth_token", mockToken, {
      path: "/",
      sameSite: "lax",
      maxAge,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error occurred while processing login." },
      { status: 500 }
    );
  }
}
