import type { NextConfig } from "next";

// Default to the shared hackathon Convex deployment so teammates don't need
// to configure anything to run the project locally. Override via .env.local
// or Vercel env vars when needed.
const DEFAULT_CONVEX_URL = "https://neat-iguana-318.convex.cloud";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CONVEX_URL:
      process.env.NEXT_PUBLIC_CONVEX_URL ?? DEFAULT_CONVEX_URL,
  },
};

export default nextConfig;
