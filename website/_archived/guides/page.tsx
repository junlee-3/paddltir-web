import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "./guides";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { BasGraphic, DeductionsGraphic } from "./graphics";

export const metadata: Metadata = {
  title: "Guides: crew seating and race day",
  description:
    "Reference guides for dragon boat crew managers: how to seat a standard boat, run multiple heats, and keep lineups balanced before you push off.",
  alternates: { canonical: "/guides" },
};

/* ---------------------------------------------------------------------------
   /guides — index of the reference guides. Quiet title plus card grid,
   reusing the matching Clinical graphics.
--------------------------------------------------------------------------- */

const SITE = "https://paddltir-web.vercel.app";

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE}/guides`,
      name: "Guides: crew seating and race day",
      url: `${SITE}/guides`,
      inLanguage: "en-AU",
      publisher: { "@id": `${SITE}/#org` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: GUIDES.map((g, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: g.title,
          url: `${SITE}/guides/${g.slug}`,
        })),
      },
    },
    breadcrumbJsonLd([{ name: "Guides", path: "/guides" }]),
  ],
};

function CardGraphic({ slug }: { slug: string }) {
  const cls = "h-auto w-full max-w-[280px]";
  if (slug === "ai-agent-tax-deductions") return <DeductionsGraphic className={cls} />;
  if (slug === "can-ai-do-my-bas") return <BasGraphic className={cls} />;
  return null;
}

export default function GuidesIndexPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 pb-24 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <h1
        className="reveal-lcp text-[clamp(2rem,5vw,3rem)] font-normal leading-[1.06] tracking-tight2 text-zinc-900"
        style={{ "--reveal-delay": "0s" } as React.CSSProperties}
      >
        Guides
      </h1>
      <p className="reveal mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-500">
        Practical answers for crew seating and race day — one question at a
        time. Built for coaches and sweeps who need lineups right before the
        horn.
      </p>

      <section className="mt-10 sm:mt-12" aria-label="All guides">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((guide, i) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="card card-hover reveal group flex flex-col overflow-hidden"
              style={{ "--reveal-delay": `${0.12 + i * 0.06}s` } as React.CSSProperties}
            >
              <div className="flex h-[190px] items-center justify-center border-b border-zinc-100 bg-zinc-50/70 px-8">
                <CardGraphic slug={guide.slug} />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-[1.2rem] font-normal leading-snug tracking-tight1 text-zinc-900">
                  {guide.title}
                </h2>
                <p className="mt-2.5 line-clamp-3 text-[14px] leading-relaxed text-zinc-500">
                  {guide.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
