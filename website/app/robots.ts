import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /account is deliberately NOT disallowed: it's linked from the nav, so a
        // robots block leaves Google stuck on "Blocked by robots.txt" forever.
        // Crawlers get the anonymous 307 → /onboard plus an X-Robots-Tag: noindex
        // header (next.config.ts), which keeps it out of the index cleanly.
        disallow: ["/api/", "/onboard/verify"],
      },
    ],
    sitemap: "https://ato-mcp.com.au/sitemap.xml",
  };
}
