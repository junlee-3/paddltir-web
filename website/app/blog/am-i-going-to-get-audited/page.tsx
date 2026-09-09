import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { BLOG_POSTS } from "../posts";
import { AuditGraphic } from "../graphics";
import { blogPostingJsonLd, postMetadata } from "../seo";
import { ClosingCta } from "@/components/site/ClosingCta";

const POST = BLOG_POSTS.find((p) => p.slug === "am-i-going-to-get-audited")!;

const SEO = {
  title: "Check dragon boat lineup balance before you load",
  description:
    "Second-guessed the heat at 6am? How to check left-right and fore-aft balance before you load — not after you bury a gunwale.",
};

export const metadata: Metadata = postMetadata(POST, SEO);

/* ---------------------------------------------------------------------------
   /blog/am-i-going-to-get-audited — pre-load balance check: the doubt, what to
   look at, a morning example, what balance tells you and what it doesn't.
--------------------------------------------------------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "What's a reasonable left-right weight gap?",
    a: "Club boats often aim for within a few kilos total. Exact numbers matter less than sudden swings — if you're 8 kg off one side, move someone before you push off.",
  },
  {
    q: "The boat looked fine at the dock but felt wrong on the water",
    a: "Static balance at rest isn't the whole story — paddle weight and reach matter — but big static skew usually gets worse under load. Fix obvious skew first.",
  },
  {
    q: "Should I re-check after a last-minute swap?",
    a: "Yes. One substitution can flip side count and stern weight. Thirty seconds at the screen beats a 500m with the gunwale in the drink.",
  },
  {
    q: "Does balance guarantee a fast time?",
    a: "No. It guarantees you're not fighting the hull before technique even starts. Speed still needs fitness, timing, and a decent catch.",
  },
  {
    q: "We eyeball it — isn't that enough?",
    a: "Sometimes. If you've raced the same ten people for years, maybe. New crew, guest paddlers, or a reserve swap is when eyeball fails.",
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
      { name: POST.title, path: "/blog/am-i-going-to-get-audited" },
    ]),
  ],
};

export default function BalancePost() {
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
              The doubt that hits at 6am
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              You locked the lineup last night. This morning someone&apos;s
              sick and a reserve stepped in — same side, you told yourself,
              should be fine. Still you stare at the boat rack wondering if
              the stern is too heavy, if the port side has one too many
              left-handers, if you&apos;re about to learn the hard way.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              That feeling isn&apos;t superstition. Dragon boats punish lazy
              balance. A few kilos the wrong way and the crew spends the race
              correcting instead of driving.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Check before you load
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Run two passes on the lineup: left versus right headcount and
              weight, then bow, middle, and stern totals. Flags are simple —
              more than two paddlers&apos; worth of skew on a side, or one
              section carrying half the crew&apos;s mass. Swap one seat and
              look again.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              What you get isn&apos;t a guarantee of gold. It&apos;s a short
              list: this side heavy, this end light, move this person. Doubt
              with a to-do list beats doubt in the dark.
            </p>
            <div className="tile mt-6 flex items-center justify-center p-6 sm:p-10">
              <AuditGraphic className="h-auto w-full max-w-[320px]" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Priya&apos;s reserve swap
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Priya&apos;s Open heat lost a 95 kg stern paddler to a flu.
              Reserve was 68 kg, same side. Side count still balanced but stern
              dropped 27 kg. She moved a 82 kg middle to seat 9, checked
              totals again, loaded.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Priya is made up. The swap logic isn&apos;t — weight and side
              interact. One substitution can fix headcount while breaking trim.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What balance is, and isn&apos;t
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Balance check doesn&apos;t replace coaching or hours on the
              water. It removes the obvious foot-gun — the listing boat, the
              buried bow, the crew that spent 500m fighting geometry instead
              of the race plan.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              If you&apos;re still doing this in your head,{" "}
              <Link href="/app" className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900">
                Paddltir
              </Link>{" "}
              totals update as you drag seats. Same check, less 6am anxiety.
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
