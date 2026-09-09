import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Content-Security-Policy. Prerendered marketing pages can't carry a per-request
// nonce, so script-src keeps 'unsafe-inline' (Next.js hydration + the inline gtag
// bootstrap). Allowlisted third parties:
//   - Google Analytics (GA4 gtag): googletagmanager.com serves gtag.js; measurement
//     beacons go to *.google-analytics.com / *.analytics.google.com, and — because
//     Google Signals is enabled on this property — augmentation beacons also hit
//     analytics.google.com (apex), *.g.doubleclick.net and *.google.com. The GA
//     domains are also in img-src for gtag's image-beacon fallback.
//   - Vercel Analytics: same-origin /_vercel/insights + va.vercel-scripts.com script.
//   - Supabase auth: the project origin the browser client talks to (magic-link /
//     OAuth), plus the custom auth./api. domains.
const googleAnalytics = [
  "https://www.googletagmanager.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://analytics.google.com",
  "https://*.g.doubleclick.net",
  "https://*.google.com",
];
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  ["img-src 'self' data:", "https://*.google-analytics.com", "https://*.googletagmanager.com"].join(" "),
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com",
  [
    "connect-src 'self'",
    ...googleAnalytics,
    "https://va.vercel-scripts.com",
    "https://*.supabase.co",
    "https://auth.ato-mcp.com.au",
    "https://api.ato-mcp.com.au",
  ].join(" "),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Nothing on the site (including /oauth/consent) should ever be framed.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // includeSubDomains covers api. and auth. (both HTTPS-only). `preload` is
  // deliberately omitted — it's a near-irreversible commitment; add it plus
  // hstspreload.org submission as a separate decision.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // transpile local stub (file:./vendor/ato-mcp-shared)
  transpilePackages: ["@ato-mcp/shared"],
  // Repo root has its own package-lock; pin tracing to website parent.
  outputFileTracingRoot: path.join(__dirname, ".."),
  eslint: {
    // Root eslint.config.js is for the Vite app; don't fail website builds on it.
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // Vite SPA under /app — filesystem (assets) wins; missing paths → index.html
  async rewrites() {
    return [
      { source: "/app", destination: "/app/index.html" },
      { source: "/app/", destination: "/app/index.html" },
      { source: "/app/:path*", destination: "/app/index.html" },
    ];
  },
};

export default nextConfig;
