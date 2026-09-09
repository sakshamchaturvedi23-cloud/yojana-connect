import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isSupabaseConfigured, getSupabaseServerClient } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, confirmPassword, token: clientToken, user: clientUser } = body;

    // If client already registered with Supabase and syncs session
    if (clientToken && clientUser) {
      const response = NextResponse.json({
        success: true,
        token: clientToken,
        user: clientUser,
        message: "Registration synchronized",
      });

      response.cookies.set("auth_token", clientToken, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    }

    // Field validations
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your full legal name." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match." },
        { status: 400 }
      );
    }

    // 1. Register with Supabase if configured on server
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (!error && data.user) {
          const user = {
            id: data.user.id,
            name: fullName.trim(),
            email: data.user.email || email.trim().toLowerCase(),
          };

          const token = data.session?.access_token || `jwt_supabase_${data.user.id}`;

          const response = NextResponse.json({
            success: true,
            token,
            user,
            message: "Registration successful",
          });

          response.cookies.set("auth_token", token, {
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === "production",
          });

          return response;
        }

        if (error) {
          return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
          );
        }
      }
    }

    // 2. Fallback: local user registration with mock token
    const user = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
    };

    const mockToken = `jwt_mock_${Buffer.from(JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + 86400000 })).toString("base64")}`;

    const response = NextResponse.json({
      success: true,
      token: mockToken,
      user,
      message: "Registration successful",
    });

    response.cookies.set("auth_token", mockToken, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error occurred while registering user." },
      { status: 500 }
    );
  }
}
