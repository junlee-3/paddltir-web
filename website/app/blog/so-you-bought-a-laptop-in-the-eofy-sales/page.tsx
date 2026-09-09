import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { BLOG_POSTS } from "../posts";
import { DepreciationGraphic } from "../graphics";
import { Cite } from "../cite";
import { blogPostingJsonLd, postMetadata } from "../seo";
import { ClosingCta } from "@/components/site/ClosingCta";

const POST = BLOG_POSTS.find((p) => p.slug === "so-you-bought-a-laptop-in-the-eofy-sales")!;

const SEO = {
  title: "Instant asset write-off and depreciation with an AI agent",
  description:
    "Ask your agent how to write off equipment: the $20,000 instant asset write-off for 2025-26, depreciation schedules compared, and the rule behind each number.",
};

export const metadata: Metadata = postMetadata(POST, SEO);

/* ---------------------------------------------------------------------------
   /blog/so-you-bought-a-laptop-in-the-eofy-sales — a story-shaped guide: the EOFY laptop, the turn (it
   shows its working), Dan's ute and the pool, the traps, FAQ.
--------------------------------------------------------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is the write-off money back in my pocket?",
    a: "No, it's a deduction: it reduces your taxable income, so the cash benefit is roughly your marginal tax rate times the deduction. A $2,000 write-off does not refund $2,000.",
  },
  {
    q: "Can I write off more than one asset?",
    a: "Yes. The $20,000 threshold applies per asset, so a $12,000 mower, a $9,000 trailer and a $3,000 laptop can each be written off in full in the same year, provided each is used or installed ready for use in that year.",
  },
  {
    q: "What about cars?",
    a: "Cars have their own cap: the car limit ($69,674 for 2025-26) caps the cost you can depreciate regardless of what you paid. Many utes and vans designed to carry a tonne or more are not \"cars\" for this rule, so ask with the specific vehicle in hand and your agent can check the definition and the current limit, cited.",
  },
  {
    q: "Can I claim it if I bought the asset on finance?",
    a: "Generally yes: eligibility follows the asset's cost and when it was first used, not how you paid. Interest on a business loan is a separate deduction question your agent can check, with its own source.",
  },
  {
    q: "Do second-hand assets qualify?",
    a: "For the small business instant asset write-off, yes: new or second-hand. One trap the tool flags: for residential rental properties, second-hand depreciating assets acquired after 9 May 2017 are generally not deductible.",
  },
  {
    q: "What happens when I sell the asset?",
    a: "A balancing adjustment: the sale proceeds are compared with the asset's remaining value and the difference is assessable or deductible. For pooled assets, proceeds reduce the pool balance instead. Worth asking about before you sell, not after.",
  },
  {
    q: "Is the 2026-27 threshold locked in?",
    a: "Not yet. A change has been announced but has not become law, and under current law the $20,000 limit applies to assets first used or installed ready for use by 30 June 2026. Because the corpus rebuilds monthly and thresholds are stored per year, your agent's answer updates when the law does.",
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
      { name: "Write off equipment", path: "/blog/so-you-bought-a-laptop-in-the-eofy-sales" },
    ]),
  ],
};

export default function DepreciationPost() {
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
          So you bought a laptop in the EOFY sales
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
              The question behind the question
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              &quot;Can I write this off?&quot; is rarely the real question.
              The real question is how much, and when. And for a small
              business (aggregated turnover under $10 million), the 2025-26
              answer is unusually good: anything costing less than $20,000 can
              come off your taxable income in full under the{" "}
              <Cite href="https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/depreciation-and-capital-expenses-and-allowances/simpler-depreciation-for-small-business/instant-asset-write-off">
                instant asset write-off
              </Cite>
              , this year, the year you actually spent the money. Per asset,
              not per year, so the mower, the trailer and the laptop can each
              qualify.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              It shows its working
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              You tell your agent what happened: bought a laptop in May,
              $2,899, mostly for work. It doesn&apos;t reply with a number
              pulled from the air. It runs every method you&apos;re eligible
              for as an actual schedule, the same formulas the law prescribes,
              and where a method doesn&apos;t apply, it says so and tells you
              why instead of quietly leaving it out.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              For the laptop the answer is short: under the threshold, 80%
              business use, $2,319 off this year&apos;s taxable income, with
              the section behind it (<Cite href="https://www.legislation.gov.au/C2004A05138/latest/text">ITAA 1997 s 328-180</Cite>).
              Some choices the
              law leaves to you, like prime cost versus diminishing value on
              bigger assets. It won&apos;t pretend to make them. It puts both
              schedules side by side, cited, and the decision stays where it
              belongs: with you.
            </p>
            <div className="tile mt-6 flex items-center justify-center p-6 sm:p-10">
              <DepreciationGraphic className="h-auto w-full max-w-[320px]" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Then there&apos;s the ute
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Dan landscapes his way across the northern suburbs. Same year,
              two purchases: the $2,899 laptop, and a $24,000 ute. The laptop
              is easy, as above. The ute is over the line, so it takes the
              slower road: the{" "}
              <Cite href="https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/depreciation-and-capital-expenses-and-allowances/simpler-depreciation-for-small-business/small-business-pool-calculations">
                small business pool
              </Cite>
              . 15% in the first year ($3,600), then 30% of what&apos;s left
              each year after ($6,120, then $4,284, and so on down). Slower,
              but it all gets there.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              And a rule almost nobody mentions: if the whole pool ever dips
              under the write-off threshold at 30 June, the entire balance can
              come off at once. His agent tracks that against the year&apos;s
              threshold so he doesn&apos;t have to.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Dan is made up. The thresholds, rates and pool mechanics are
              real for 2025-26 (ITAA 1997 Subdiv 328-D).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Before the EOFY sales get you again
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Two traps, both cheap to avoid. The asset has to be first used,
              or installed ready for use, by 30 June: ordered, paid for and
              sitting in a warehouse doesn&apos;t count. And the $20,000 is
              GST-exclusive if you&apos;re registered (you claim that GST back
              on your BAS anyway), which means a $21,500 sticker price can
              still sneak under.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              A change to the threshold for 2026-27 has been announced but is
              not yet law, and that&apos;s exactly why the answers come with
              dates and sources: the rule you remember is so often the rule
              from a different year. None of this is tax advice. For the big
              calls, take the schedules and the citations to a registered tax
              agent and make the decision together.
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
