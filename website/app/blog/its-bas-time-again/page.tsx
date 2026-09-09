import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { BLOG_POSTS } from "../posts";
import { BasGraphic } from "../graphics";
import { blogPostingJsonLd, postMetadata } from "../seo";
import { ClosingCta } from "@/components/site/ClosingCta";

const POST = BLOG_POSTS.find((p) => p.slug === "its-bas-time-again")!;

const SEO = {
  title: "Race weekend crew roster checklist",
  description:
    "How to keep dragon boat regatta rosters calm: who's in, who's scratched, which heat needs a sweep, and where to put changes so nothing breaks the next race.",
};

export const metadata: Metadata = postMetadata(POST, SEO);

/* ---------------------------------------------------------------------------
   /blog/its-bas-time-again — race weekend ritual: the scramble, a roster workflow,
   a Saturday regatta walkthrough, what a good tool won't do for you.
--------------------------------------------------------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "How early should I lock the roster?",
    a: "Final lock the night before for travel planning, then one pass at the tent before each heat. Late scratches happen — you want a single place to edit without rebuilding every lineup from memory.",
  },
  {
    q: "One roster or separate lists per heat?",
    a: "Separate lineups per heat. Open 500m and Mixed 200m share paddlers but not seats. Editing one sheet for both is how you seat someone in two places at once.",
  },
  {
    q: "What if we don't have a sweep for a heat?",
    a: "Flag it early. Borrow from another crew, swap a paddler who holds sweep cert, or scratch the heat — but decide at the tent, not at the dock when the marshal is waiting.",
  },
  {
    q: "Should reserves sit on the same lineup?",
    a: "Keep them visible but unassigned, or in a bench row if your tool supports it. You need to see who's available without counting heads in the carpark.",
  },
  {
    q: "How do I handle paddlers racing multiple divisions?",
    a: "Note the conflict in both heats. Staggered schedules usually work; overlapping heats need a call and a substitute before call time, not after.",
  },
  {
    q: "Can Paddltir replace our regatta entry system?",
    a: "No — you still enter crews with the regatta organiser. Paddltir is for internal lineups: who sits where once you're accepted into the draw.",
  },
];

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    blogPostingJsonLd(POST),
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    breadcrumbJsonLd([
      { name: "Blog", path: "/blog" },
      { name: POST.title, path: "/blog/its-bas-time-again" },
    ]),
  ],
};

export default function RaceWeekendPost() {
  return (
    <>
    <main className="mx-auto min-h-screen max-w-5xl px-5 pb-24 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <div className="mx-auto max-w-3xl">

        {/* ----------------------------------------------- header */}
        <Link
          href="/blog"
          className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-zinc-500 transition-colors hover:text-zinc-600"
        >
          ← All posts
        </Link>
        <div className="mt-6 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <p className="eyebrow">{POST.tag}</p>
          <span className="font-mono text-[0.6875rem] text-zinc-300" aria-hidden="true">·</span>
          <p className="font-mono text-[0.6875rem] text-zinc-500">
            <time dateTime={POST.date}>{POST.dateLabel}</time>
          </p>
          <span className="font-mono text-[0.6875rem] text-zinc-300" aria-hidden="true">·</span>
          <p className="font-mono text-[0.6875rem] text-zinc-500">{POST.readingTime}</p>
        </div>
        <h1
          className="reveal-lcp mt-3 text-[clamp(2rem,4vw,2.75rem)] font-normal leading-[1.08] tracking-tight2 text-zinc-900"
          style={{ "--reveal-delay": "0s" } as React.CSSProperties}
        >
          {POST.title}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-zinc-500">
          {POST.description}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          <span className="font-medium text-zinc-700">In short:</span>{" "}
          {SEO.description}
        </p>

        {/* ----------------------------------------------- story */}
        <div className="mt-12 space-y-12">
          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              The scramble you know by heart
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Every regatta starts the same way: draw published, WhatsApp
              erupts, three people confirm and two go quiet. Someone asks if
              the 200m is before or after lunch. Someone else thought they
              were reserve for Open but they&apos;re listed in Mixed. The
              tent becomes a courtroom.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              The racing is the easy part. The admin is four heats, two
              boats, eighteen names that move between them, and a sweep who
              only drives the 500m. Get the roster wrong and the penalty is
              wasted warm-up, a rushed seat change, or a DNS you didn&apos;t
              see coming.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              A checklist instead of a group chat
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Work top down: confirm who&apos;s on deck for the day, then
              one lineup per heat. For each heat note drummer, sweep, and
              full paddling order. Scratch someone in Heat 2 and the change
              stays in Heat 2 — Heat 3 shouldn&apos;t inherit it by accident.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              The traps are always the same: same person named twice across
              overlapping heats, a reserve still marked &quot;in&quot; when
              they&apos;re travelling, sweep missing on the sheet but not in
              anyone&apos;s head. A roster tool puts those conflicts where
              you can see them before the marshal calls your lane.
            </p>
            <div className="tile mt-6 flex items-center justify-center p-6 sm:p-10">
              <BasGraphic className="h-auto w-full max-w-[320px]" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Tom&apos;s Saturday at Penrith
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Tom&apos;s club has four heats across two divisions. Friday
              night he marks two scratches and drops reserves into Open 500m
              and Women&apos;s 200m. Saturday 7am: one reserve turns up
              after all, so he swaps her into Mixed 500m and pulls a
              paddler who&apos;d doubled up.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Because each heat is its own lineup, the Women&apos;s 200m
              sheet never moved. Call time for Open is 8:12; he prints
              nothing, just reads seat numbers off his phone at the dock.
              Tom is made up. The draw chaos is not.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What the roster can&apos;t do
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              It won&apos;t enter you in the regatta or talk to the
              organiser&apos;s system. It won&apos;t make paddlers reply to
              messages. What it does is hold the lineups you&apos;re
              responsible for — so when the horn is twenty minutes away
              you&apos;re checking balance and warm-up, not rebuilding a
              spreadsheet from scratch.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              If your club is still on a shared sheet for this,{" "}
              <Link href="/app" className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900">
                try Paddltir
              </Link>{" "}
              for the next meet. Same people, same heats, less tent drama.
            </p>
          </section>
        </div>

        {/* ----------------------------------------------- FAQ */}
        <section className="mt-16" aria-labelledby="faq-h">
          <h2 id="faq-h" className="text-lg font-medium tracking-tight1 text-zinc-900">
            The questions everyone asks eventually
          </h2>
          <div className="mt-4">
            {FAQS.map((f) => (
              <details key={f.q} className="group border-b border-zinc-100 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium marker:hidden">
                  <h3 className="text-[15px] font-medium">{f.q}</h3>
                  <span
                    className="text-lg font-normal text-zinc-400 transition-transform duration-300 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
    <ClosingCta />
    </>
  );
}
