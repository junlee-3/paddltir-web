import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/urls";

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
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
