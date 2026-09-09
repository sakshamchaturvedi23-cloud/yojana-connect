import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  const cookiesToClear = [
    "auth_token",
    "yojana_token",
    "sb-access-token",
    "sb-refresh-token",
  ];

  for (const name of cookiesToClear) {
    response.cookies.set(name, "", {
      path: "/",
      sameSite: "lax",
      expires: new Date(0),
    });
  }

  return response;
}

