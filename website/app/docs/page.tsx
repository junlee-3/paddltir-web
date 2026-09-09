import type { Metadata } from "next";
import { TOOLS_META } from "../../lib/tools-meta";
import { breadcrumbJsonLd } from "../../lib/breadcrumbs";
import { personRef } from "../../lib/schema";
import { ClosingCta } from "@/components/site/ClosingCta";
import { GitHubIcon } from "@/components/site/GitHubIcon";

export const metadata: Metadata = {
  title: "Docs: the 13 tools your agent gets",
  description:
    "The 13 tools ato-mcp gives your AI agent: cited search over 34,500+ ATO documents, definitions, thresholds, your tax profile and four deterministic workflows.",
  alternates: { canonical: "/docs" },
};

/* ---------------------------------------------------------------------------
   /docs — the tool reference. Install lives on /install; this page answers
   the question that follows the pitch: what can the agent actually do once
   it's connected? Each group is an editorial row (label, narrative beat,
   description) beside its card grid, echoing the homepage corpus section.
--------------------------------------------------------------------------- */

const GROUPS: {
  key: "Workflows" | "Retrieval" | "Personal context";
  heading: string;
  description: string;
}[] = [
  {
    key: "Workflows",
    heading: "The questions that come back every year",
    description:
      "What can I claim, how does the laptop write off, what goes on the BAS, is anything risky. Four workflows that run the numbers deterministically, shaped to your taxpayer structure, with the ATO source on every line.",
  },
  {
    key: "Retrieval",
    heading: "Straight from the source",
    description:
      "Eight ways into 34,500+ ATO documents: hybrid search, whole documents in reading order, statutory definitions, point-in-time thresholds and the citation graph connecting them.",
  },
  {
    key: "Personal context",
    heading: "It knows your situation",
    description:
      "One read of your saved tax profile replaces twenty clarifying questions. Sole trader or company, GST-registered or not: answers fit how you actually operate.",
  },
];

const docsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      headline: "ato-mcp documentation",
      description:
        "The 13 Australian-tax tools ato-mcp gives an AI agent, with examples.",
      author: personRef(),
      publisher: { "@id": "https://ato-mcp.com.au/#org" },
      datePublished: "2026-05-26",
      dateModified: "2026-07-23",
      url: "https://ato-mcp.com.au/docs",
      mainEntityOfPage: "https://ato-mcp.com.au/docs",
      image: "https://ato-mcp.com.au/opengraph-image",
    },
    breadcrumbJsonLd([{ name: "Documentation", path: "/docs" }]),
  ],
};

export default function DocsPage() {
  return (
    <>
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(docsJsonLd) }}
      />

      <h1 className="reveal-lcp max-w-2xl text-[clamp(2rem,5vw,3rem)] font-normal leading-[1.06] tracking-tight2 text-zinc-900">
        What your agent can actually do
      </h1>

      {/* ----------------------------------------------- tool groups */}
      <div id="toolsref-h" className="mt-16 scroll-mt-24 space-y-16 sm:space-y-20">
        {GROUPS.map((g) => (
          <section key={g.key} aria-labelledby={`group-${g.key}`} className="reveal-scroll">
            <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-12">
              <div>
                <h2
                  id={`group-${g.key}`}
                  className="text-[1.35rem] font-normal leading-[1.15] tracking-tight1 text-zinc-900"
                >
                  {g.heading}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  {g.description}
                </p>
              </div>
              <div className="grid content-start gap-3 md:grid-cols-2">
                {TOOLS_META.filter((t) => t.group === g.key).map((t) => (
                  <article key={t.name} className="card p-5">
                    <h3 className="text-[15px] font-medium text-zinc-900">
                      {t.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{t.summary}</p>
                    <pre className="code-block mt-3 whitespace-pre-wrap px-3 py-2 text-[0.6875rem]">
                      <code>{t.example}</code>
                    </pre>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        Full reference documentation:{" "}
        <a
          className="inline-flex items-center gap-1.5 text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900"
          href="https://github.com/william-laverty/ato-mcp/blob/main/docs/tools.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon size={15} />
          github.com/william-laverty/ato-mcp/docs/tools.md
        </a>
      </p>

    </main>
    <ClosingCta />
    </>
  );
}
