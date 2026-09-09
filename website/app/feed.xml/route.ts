import { BLOG_POSTS } from "@/app/blog/posts";

const SITE = "https://ato-mcp.com.au";

const escape = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// Prerendered at build time (the posts registry is the only input), served
// as a static asset like sitemap.xml.
export const dynamic = "force-static";

export function GET() {
  const items = [...BLOG_POSTS]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(
      (post) => `    <item>
      <title>${escape(post.title)}</title>
      <link>${SITE}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${post.slug}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00+10:00`).toUTCString()}</pubDate>
      <description>${escape(post.description)}</description>
    </item>`,
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Australian Tax MCP blog</title>
    <link>${SITE}/blog</link>
    <description>Notes on doing your own tax with an AI agent, from the Australian tax knowledge base for AI agents.</description>
    <language>en-AU</language>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(rss, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
