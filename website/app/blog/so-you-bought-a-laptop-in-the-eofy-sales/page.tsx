import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { BLOG_POSTS } from "../posts";
import { DepreciationGraphic } from "../graphics";
import { blogPostingJsonLd, postMetadata } from "../seo";
import { ClosingCta } from "@/components/site/ClosingCta";

const POST = BLOG_POSTS.find((p) => p.slug === "so-you-bought-a-laptop-in-the-eofy-sales")!;

const SEO = {
  title: "Crew weight and dragon boat trim",
  description:
    "You weighed the whole crew — now what? How paddler weight and preferred side affect seating, and why trim shows up before the start horn.",
};

export const metadata: Metadata = postMetadata(POST, SEO);

/* ---------------------------------------------------------------------------
   /blog/so-you-bought-a-laptop-in-the-eofy-sales — after the weigh-in: using weight
   data, bow-stern balance, a club example, common mistakes.
--------------------------------------------------------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "Do we need exact weights for every paddler?",
    a: "Close enough is fine for club racing — within a kilo or two. What matters is relative: who's heavy, who's light, and where they sit compared to last time.",
  },
  {
    q: "Where should the heavy paddlers go?",
    a: "Many crews load stern for trim because the drummer and sweep add weight forward. Your boat and crew differ — track what worked when the boat felt flat, not what a forum post said once.",
  },
  {
    q: "Does side weight matter as much as bow-stern?",
    a: "Both matter. Side imbalance shows up in the catch; fore-aft imbalance shows up as bow bury or stern squat. Fix side first — it's faster to spot on the pontoon.",
  },
  {
    q: "We only weighed people once last season",
    a: "Still useful. Re-weigh once a year or when someone's visibly changed. Update the roster so you're not guessing from memory.",
  },
  {
    q: "Juniors and seniors in the same boat?",
    a: "Spread weight deliberately. A row of light juniors in the bow and seniors in the stern can pitch the boat even if sides balance. Mix for trim, not just for vibes.",
  },
  {
    q: "Can Paddltir show total weight by section?",
    a: "Yes — as you seat people, you see weight by bow, middle, and stern plus left-right totals. That's the point of weighing once and saving it.",
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
      { name: POST.title, path: "/blog/so-you-bought-a-laptop-in-the-eofy-sales" },
    ]),
  ],
};

export default function CrewWeightPost() {
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
              The spreadsheet full of numbers
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              You did the awkward thing and weighed everyone after training.
              Eighty-two kilos, fifty-eight, seventy-one — a column of figures
              that felt useful for about a day. Then race morning arrived and
              you seated by side preference anyway because the weight column
              lived in a different tab nobody opened.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Weight only helps when it sits next to the lineup. The question
              isn&apos;t &quot;how much does Sam weigh?&quot; It&apos;s
              &quot;if Sam sits in 6, what happens to the stern?&quot;
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Read the boat in three bands
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Split the crew into bow (seats 1–4), middle (5–8), stern
              (9–10 plus drummer and sweep at the ends). You want each band
              roughly in the same ballpark, with small tweaks for your hull.
              Drag someone forward and watch the bow band total drop — that's
              the calculation worth doing before launch.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Side totals run in parallel. Left-right within a kilo or two is
              a reasonable club target. Off-side seating for balance is fine;
              just know you're trading trim for power on that seat.
            </p>
            <div className="tile mt-6 flex items-center justify-center p-6 sm:p-10">
              <DepreciationGraphic className="h-auto w-full max-w-[320px]" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Lin&apos;s crew after weigh-in day
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Lin imported weights into Paddltir and rebuilt the usual Open
              lineup. Stern was 12 kg heavy — she swapped two middles toward
              the back and pulled a 90 kg paddler from seat 10 to seat 5.
              Side count stayed even. On the water the boat stopped feeling
              like the bow was fighting the wake.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Lin is made up. The physics isn&apos;t: fore-aft trim changes
              how the hull rides, and you feel it in the first ten strokes
              if you got it wrong.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Before the next regatta
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Two habits: store weight on the paddler profile so it travels
              with the name, and glance at section totals every time you
              change a seat. Weigh-in day is annual; trim is every heat.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              If your numbers are still in a tab from last season, move them
              into{" "}
              <Link href="/app" className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900">
                Paddltir
              </Link>{" "}
              once and seat with the totals visible. You'll use the data or
              you won't — there&apos;s no third option.
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
