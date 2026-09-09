import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api (API endpoints)
     * - _next/static (static assets)
     * - _next/image (image optimization)
     * - favicon.ico, images/ (static public assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
