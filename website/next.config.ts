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
  // img-src carries gtag's image-beacon fallback AND the Google Signals
  // audience beacons, which hit www.google.com/ads/ga-audiences plus the
  // visitor's country domain (www.google.com.au for AU) and *.g.doubleclick.net.
  // Without those three, every page logs a CSP violation to the console the
  // moment Signals fires (it cost the site its Lighthouse best-practices score).
  [
    "img-src 'self' data: blob:",
    "https://*.google-analytics.com",
    "https://*.googletagmanager.com",
    "https://*.g.doubleclick.net",
    "https://*.google.com",
    "https://*.google.com.au",
    "https://*.supabase.co",
  ].join(" "),
  "font-src 'self' https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com",
  [
    "connect-src 'self'",
    ...googleAnalytics,
    "https://va.vercel-scripts.com",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://paddltir-web.vercel.app",
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

// MCP clients are sometimes pointed at the website domain instead of the API.
// Vercel analytics shows probes against these transport paths; 308 (method-
// preserving, so POST survives) sends them to the real endpoint instead of a
// 404. None of these collide with site routes.
const MCP_PROBE_PATHS = [
  "/mcp",
  "/mcp/:path*",
  "/sse",
  "/api/mcp",
  "/api/sse",
  "/v1/mcp",
  "/jsonrpc",
  "/rpc",
  "/messages",
  "/stream",
  "/events",
];

// Crawlable (not robots-blocked) but never indexable — see headers() below.
const NOINDEX_PATHS = [
  "/account",
  "/account/:path*",
  "/llms.txt",
  "/llms-full.txt",
  "/opengraph-image",
  // Per-guide OG cards (each guide folder has an opengraph-image.tsx).
  "/guides/:slug/opengraph-image",
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
    return [
      { source: "/(.*)", headers: securityHeaders },
      // Advertise the MCP endpoint to agents fetching any page (RFC 8288).
      // On-brand for a product whose customers are AI agents.
      {
        source: "/(.*)",
        headers: [
          {
            key: "Link",
            value: '<https://paddltir-web.vercel.app/app>; rel="service-desc"; title="Paddltir"',
          },
        ],
      },
      // Explicit noindex for things Google crawls but must never index: the
      // auth-gated account area (anonymous crawlers get its 307 → /onboard;
      // the header rides on that response too) and non-page assets (the OG
      // card image and the llms.txt files, which are for agents, not SERPs).
      // Without this, Search Console parks them under warning states
      // ("Blocked by robots.txt" / "Crawled - currently not indexed").
      ...NOINDEX_PATHS.map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      })),
    ];
  },
  async redirects() {
    return [
      ...MCP_PROBE_PATHS.map((source) => ({
        source,
        destination: "https://paddltir-web.vercel.app/app",
        permanent: true,
      })),
      // Retired blog → About (About took Blog's nav slot).
      { source: "/blog", destination: "/about", permanent: true },
      { source: "/blog/:path*", destination: "/about", permanent: true },
      { source: "/feed.xml", destination: "/about", permanent: true },
    ];
  },
  // Vite SPA under /app — public/assets are served as files; only app routes
  // fall back to index.html (never rewrite /app/assets/* to HTML).
  async rewrites() {
    return {
      fallback: [
        { source: "/app", destination: "/app/index.html" },
        { source: "/app/", destination: "/app/index.html" },
        { source: "/app/:page", destination: "/app/index.html" },
        { source: "/app/:page/:id", destination: "/app/index.html" },
      ],
    };
  },
};

export default nextConfig;
