import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "./posts";
import { GUIDES } from "@/app/guides/guides";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import {
  AbnGraphic,
  AiAnswersGraphic,
  AuditGraphic,
  BasGraphic,
  DeductionsGraphic,
  DepreciationGraphic,
} from "./graphics";

export const metadata: Metadata = {
  title: "Notes on doing your own tax",
  description:
    "Guides for doing your own tax with an AI agent, plus product updates from ato-mcp, the Australian tax knowledge base for AI agents.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "https://ato-mcp.com.au/blog",
    siteName: "Australian Tax MCP",
    locale: "en_AU",
    title: "Notes on doing your own tax · Australian Tax MCP",
    description:
      "Guides for doing your own tax with an AI agent, plus product updates from ato-mcp, the Australian tax knowledge base for AI agents.",
    images: [
      {
        url: "https://ato-mcp.com.au/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Australian Tax MCP: cited ATO retrieval for AI agents",
      },
    ],
  },
};

/* ---------------------------------------------------------------------------
   /blog — the post index. Orchid-style: a single quiet title, then a grid of
   vertical cards, each led by a Clinical-system graphic (the same visual
   language as the posts themselves), with tag, title and teaser below.
--------------------------------------------------------------------------- */

const SITE = "https://ato-mcp.com.au";

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      "@id": `${SITE}/blog#blog`,
      name: "ato-mcp blog",
      description:
        "Guides for doing your own tax with an AI agent, plus product updates from ato-mcp.",
      url: `${SITE}/blog`,
      publisher: { "@id": `${SITE}/#org` },
      blogPost: BLOG_POSTS.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        description: p.description,
        datePublished: p.date,
        url: `${SITE}/blog/${p.slug}`,
      })),
    },
    breadcrumbJsonLd([{ name: "Blog", path: "/blog" }]),
  ],
};

function CardGraphic({ slug }: { slug: string }) {
  const cls = "h-auto w-full max-w-[280px]";
  if (slug === "what-can-you-actually-claim") return <DeductionsGraphic className={cls} />;
  if (slug === "its-bas-time-again") return <BasGraphic className={cls} />;
  if (slug === "so-you-bought-a-laptop-in-the-eofy-sales") return <DepreciationGraphic className={cls} />;
  if (slug === "am-i-going-to-get-audited") return <AuditGraphic className={cls} />;
  if (slug === "can-you-trust-ai-with-your-tax") return <AiAnswersGraphic className={cls} />;
  if (slug === "nobody-withholds-your-tax-anymore") return <AbnGraphic className={cls} />;
  return null;
}

export default function BlogIndexPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 pb-24 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* ------------------------------------------------ title, nothing else */}
      <h1
        className="reveal-lcp text-[clamp(2rem,5vw,3rem)] font-normal leading-[1.06] tracking-tight2 text-zinc-900"
        style={{ "--reveal-delay": "0s" } as React.CSSProperties}
      >
        Notes on doing your own tax
      </h1>

      {/* ------------------------------------------------ card grid */}
      <section className="mt-10 sm:mt-12" aria-label="All posts">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card card-hover reveal group flex flex-col overflow-hidden"
              style={{ "--reveal-delay": `${0.12 + i * 0.06}s` } as React.CSSProperties}
            >
              {/* graphic header — the post's motif, standing in for a photo */}
              <div className="flex h-[190px] items-center justify-center border-b border-zinc-100 bg-zinc-50/70 px-8">
                <CardGraphic slug={post.slug} />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-[1.2rem] font-normal leading-snug tracking-tight1 text-zinc-900">
                  {post.title}
                </h2>
                <p className="mt-2.5 line-clamp-3 text-[14px] leading-relaxed text-zinc-500">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ reference guides */}
      <section className="mt-14 border-t border-zinc-100 pt-10" aria-labelledby="guides-h">
        <h2 id="guides-h" className="text-[1.35rem] font-normal tracking-tight1 text-zinc-900">
          Reference guides
        </h2>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-zinc-500">
          The question-shaped companions to these stories: direct answers,
          every figure cited.
        </p>
        <ul className="mt-5 space-y-3">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="text-[15px] text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900"
              >
                {g.title}
              </Link>
              <p className="mt-0.5 text-[13px] text-zinc-500">{g.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
