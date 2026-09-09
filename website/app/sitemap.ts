import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "./blogs/posts";

const SITE = "https://ato-mcp.com.au";

// Bump a date only when that page's content meaningfully changes.
// Stamping build time on every deploy makes Google ignore lastmod entirely.
const LAST_MODIFIED = {
  home: "2026-07-09",
  docs: "2026-07-09",
  install: "2026-07-09",
  faq: "2026-07-09",
  compare: "2026-07-09",
  about: "2026-07-09",
  blogs: "2026-07-09",
  privacy: "2026-05-26",
  terms: "2026-05-26",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // No trailing slash: matches the homepage's rendered canonical.
    { url: SITE, lastModified: LAST_MODIFIED.home, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/docs`, lastModified: LAST_MODIFIED.docs, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/install`, lastModified: LAST_MODIFIED.install, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/faq`, lastModified: LAST_MODIFIED.faq, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/compare`, lastModified: LAST_MODIFIED.compare, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/about`, lastModified: LAST_MODIFIED.about, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/blogs`, lastModified: LAST_MODIFIED.blogs, changeFrequency: "monthly", priority: 0.7 },
    ...BLOG_POSTS.map((post) => ({
      url: `${SITE}/blogs/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: `${SITE}/privacy`, lastModified: LAST_MODIFIED.privacy, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/terms`, lastModified: LAST_MODIFIED.terms, changeFrequency: "monthly", priority: 0.4 },
  ];
}
