"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Never intercept if already on /login
    if (pathname === "/login") return;

    if (!isLoading && !isAuthenticated) {
      const target =
        pathname && pathname !== "/"
          ? `/login?from=${encodeURIComponent(pathname)}`
          : "/login";

      // Trigger actual router push
      router.push(target);

      // Safe fallback redirect if client-side soft navigation stalls
      const timer = setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = target;
        }
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [isMounted, isLoading, isAuthenticated, router, pathname]);

  // If already on /login, render immediately
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Render verifying/redirecting state to avoid empty render tree
  if (!isMounted || isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center text-white">
        <div className="animate-spin h-7 w-7 border-2 border-white border-t-transparent rounded-full mb-3" />
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
          {isLoading ? "Verifying Session..." : "Redirecting to Login..."}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

