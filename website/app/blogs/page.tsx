import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "./posts";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "Blog: product updates from ato-mcp",
  description:
    "Product updates, release notes and engineering notes from ato-mcp, the Australian tax knowledge base for AI agents.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    type: "website",
    title: "Blog: product updates from ato-mcp",
    description:
      "Product updates, release notes and engineering notes from ato-mcp, the Australian tax knowledge base for AI agents.",
  },
};

/* ---------------------------------------------------------------------------
   /blogs — the post index, in the Clinical system: white page, zinc
   neutrals, hairline card borders, vermillion used only as the marker
   accent. Posts come from ./posts.ts (newest first).
--------------------------------------------------------------------------- */

const SITE = "https://ato-mcp.com.au";

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      name: "ato-mcp blog",
      description:
        "Product updates, release notes and engineering notes from ato-mcp.",
      url: `${SITE}/blogs`,
      publisher: { "@id": `${SITE}/#org` },
      blogPost: BLOG_POSTS.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        description: p.description,
        datePublished: p.date,
        url: `${SITE}/blogs/${p.slug}`,
      })),
    },
    breadcrumbJsonLd([{ name: "Blog", path: "/blogs" }]),
  ],
};

export default function BlogsIndexPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* ------------------------------------------------ index header */}
      <header className="mx-auto max-w-3xl px-5 pb-4 pt-16 text-center sm:pt-20">
        <p className="eyebrow reveal" style={{ "--reveal-delay": "0s" } as React.CSSProperties}>
          Blog
        </p>
        <h1
          className="reveal-lcp mx-auto mt-4 max-w-[20ch] text-[clamp(2rem,6vw,3.25rem)] font-normal leading-[1.06] tracking-tight2 text-zinc-900"
          style={{ "--reveal-delay": "0.08s" } as React.CSSProperties}
        >
          What&apos;s new in ato-mcp
        </h1>
        <p
          className="reveal mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-zinc-500 sm:text-base"
          style={{ "--reveal-delay": "0.16s" } as React.CSSProperties}
        >
          Product updates, release notes and the occasional look under the
          hood of the Australian tax knowledge base for AI agents.
        </p>
      </header>

      {/* ------------------------------------------------ post list */}
      <section className="mx-auto max-w-3xl px-5 pb-24 pt-10 sm:pb-28 sm:pt-12" aria-label="All posts">
        <div className="space-y-4">
          {BLOG_POSTS.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className="card reveal group block p-6 transition-colors duration-200 hover:border-zinc-300 sm:p-7"
              style={{ "--reveal-delay": `${0.2 + i * 0.06}s` } as React.CSSProperties}
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="eyebrow">{post.tag}</p>
                <time
                  dateTime={post.date}
                  className="shrink-0 font-mono text-[0.6875rem] text-zinc-400"
                >
                  {post.dateLabel}
                </time>
              </div>
              <h2 className="mt-3 max-w-xl text-[1.25rem] font-normal leading-snug tracking-tight1 text-zinc-900 sm:text-[1.4rem]">
                {post.title}
              </h2>
              <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-zinc-500">
                {post.description}
              </p>
              <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900">
                Read the post
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className="text-zinc-400 transition-transform duration-200 group-hover:translate-x-[2px]"
                >
                  <path
                    d="M5.25 3.5L8.75 7L5.25 10.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
