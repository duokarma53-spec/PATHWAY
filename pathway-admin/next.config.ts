import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;

const nextConfig: NextConfig = {
  // On GitHub Actions: static export for GitHub Pages
  // On Vercel: full Next.js server (supports Server Actions)
  ...(isGithubActions
    ? {
        output: "export",
        basePath: "/PATHWAY/admin",
        images: { unoptimized: true },
      }
    : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
