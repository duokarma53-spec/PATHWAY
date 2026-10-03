import type { NextConfig } from "next";
import path from "path";

const isGithubActions = process.env.GITHUB_ACTIONS || false;

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../"),
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
  ...(!isGithubActions
    ? {
        async headers() {
          return [
            {
              source: "/sw.js",
              headers: [
                { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
                { key: "Pragma", value: "no-cache" },
                { key: "Expires", value: "0" },
              ],
            },
            {
              source: "/manifest.webmanifest",
              headers: [
                { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
              ],
            },
            {
              source: "/:path*",
              headers: [
                { key: "X-Frame-Options", value: "DENY" },
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "X-XSS-Protection", value: "1; mode=block" },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=()",
                },
              ],
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
