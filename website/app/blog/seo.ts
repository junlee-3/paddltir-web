import type { Metadata } from "next";
import type { BlogPost } from "./posts";
import { personRef, speakable } from "@/lib/schema";

const SITE = "https://ato-mcp.com.au";

// Card images are NOT restated here: each post folder has its own
// opengraph-image.tsx (lib/og-card.tsx renders the post title/description),
// and Next's file-based metadata supplies og:image + twitter:image for the
// route. Restating an images field would override the per-post card.

/**
 * Per-post SEO. The search-facing title/description stay keyword-shaped and
 * hand-written per page; the social card (OG/Twitter) uses the post's own
 * felt-moment title and lede from the registry. Page-level openGraph replaces
 * the layout's entirely (Next shallow-merges top-level fields), so siteName
 * and locale are restated here.
 */
export function postMetadata(
  post: BlogPost,
  seo: { title: string; description: string },
): Metadata {
  const url = `${SITE}/blog/${post.slug}`;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      siteName: "Australian Tax MCP",
      locale: "en_AU",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ["William Laverty"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

/** BlogPosting node for the post's JSON-LD @graph. */
export function blogPostingJsonLd(post: BlogPost) {
  const url = `${SITE}/blog/${post.slug}`;
  return {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en-AU",
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    author: personRef(),
    publisher: { "@id": `${SITE}/#org` },
    isPartOf: { "@type": "Blog", "@id": `${SITE}/blog#blog`, name: "ato-mcp blog", url: `${SITE}/blog` },
    speakable: speakable(["main h1", "main h1 + p"]),
  };
}
