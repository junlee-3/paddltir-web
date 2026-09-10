import type { Metadata } from "next";
import { TOOLS_META } from "../../lib/tools-meta";
import { breadcrumbJsonLd } from "../../lib/breadcrumbs";
import { personRef } from "../../lib/schema";
import { SITE_URL as SITE } from "../../lib/urls";
import { ClosingCta } from "@/components/site/ClosingCta";
import { GitHubIcon } from "@/components/site/GitHubIcon";

export const metadata: Metadata = {
  title: "Docs: seat boats, manage rosters, read insights",
  description:
    "The Paddltir feature reference: lineups, rosters, and trim/balance insights for dragon boat crew management.",
  alternates: { canonical: "/docs" },
};

/* ---------------------------------------------------------------------------
   /docs — the tool reference. Answers the question that follows the pitch:
   what can you actually do once you're in the app? Each group is an
   editorial row (label, narrative beat, description) beside its card grid,
   echoing the homepage corpus section.
--------------------------------------------------------------------------- */

const GROUPS: {
  key: "Lineups" | "Rosters" | "Insights";
  heading: string;
  description: string;
}[] = [
  {
    key: "Lineups",
    heading: "Seat the boat",
    description:
      "Place paddlers left and right, set drummer and sweep, copy heats, and catch empty seats before you paddle.",
  },
  {
    key: "Rosters",
    heading: "Manage your paddlers",
    description:
      "Keep names, weights, preferred sides, and roles in one roster. Build crewlists for race weekends and track who is actually available.",
  },
  {
    key: "Insights",
    heading: "Read trim and balance",
    description:
      "See fore-aft trim, left-right side balance, lineup gaps, and heat comparisons so you confirm lineups with numbers, not guesswork.",
  },
];

const docsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      headline: "Paddltir documentation",
      description:
        "Feature reference for Paddltir: lineups, rosters, and insights for dragon boat crew management.",
      author: personRef(),
      publisher: { "@id": `${SITE}/#org` },
      datePublished: "2026-05-26",
      dateModified: "2026-07-23",
      url: `${SITE}/docs`,
      mainEntityOfPage: `${SITE}/docs`,
      image: `${SITE}/opengraph-image`,
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
        What you can actually do
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
          href="https://github.com/junlee-3/paddltir-web"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon size={15} />
          github.com/junlee-3/paddltir-web
        </a>
      </p>

    </main>
    <ClosingCta />
    </>
  );
}
