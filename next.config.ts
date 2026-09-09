import type { NextConfig } from "next";
import path from "node:path";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:5001";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/profile",
          destination: `${BACKEND_URL}/api/profile`,
        },
        {
          source: "/api/bookmarks/:path*",
          destination: `${BACKEND_URL}/api/bookmarks/:path*`,
        },
        {
          source: "/api/bookmarks",
          destination: `${BACKEND_URL}/api/bookmarks`,
        },
        {
          source: "/api/recommendations",
          destination: `${BACKEND_URL}/api/recommendations`,
        },
        {
          source: "/api/chat",
          destination: `${BACKEND_URL}/api/chat`,
        },
        {
          source: "/api/schemes/:path*",
          destination: `${BACKEND_URL}/api/schemes/:path*`,
        },
        {
          source: "/api/schemes",
          destination: `${BACKEND_URL}/api/schemes`,
        },
        {
          source: "/api/health",
          destination: `${BACKEND_URL}/api/health`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
