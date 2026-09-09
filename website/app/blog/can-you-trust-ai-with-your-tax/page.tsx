import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { BLOG_POSTS } from "../posts";
import { AiAnswersGraphic } from "../graphics";
import { Cite } from "../cite";
import { blogPostingJsonLd, postMetadata } from "../seo";
import { ClosingCta } from "@/components/site/ClosingCta";

const POST = BLOG_POSTS.find((p) => p.slug === "can-you-trust-ai-with-your-tax")!;

const SEO = {
  title: "Can AI answer Australian tax questions correctly?",
  description:
    "Generic AI answers about Australian tax can be years out of date. Ground your agent in 34,500+ ATO documents; every answer carries its citation for 2025-26.",
};

export const metadata: Metadata = postMetadata(POST, SEO);

/* ---------------------------------------------------------------------------
   /blog/can-you-trust-ai-with-your-tax — a story-shaped guide: the confident stale answer, why it
   happens, what grounding changes, and the test you can run yourself.
--------------------------------------------------------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is it actually safe to use AI for my tax?",
    a: "Used as a cited research layer, yes: you check the source, not the vibe. Used as an oracle, no. The disclaimer on this whole site is real: retrieval and fixed calculations with citations, not tax advice.",
  },
  {
    q: "Why do AI answers about tax go stale?",
    a: "Training data has a cutoff date, and Australian tax changes every year: rates, thresholds, methods, sometimes whole rules. An answer can be fluent, plausible and two years out of date at the same time.",
  },
  {
    q: "What does ato-mcp actually change?",
    a: "The source of the answer. Instead of memory, your agent searches a corpus rebuilt monthly from ato.gov.au, the Federal Register of Legislation and law.ato.gov.au, and returns passages with their citations attached.",
  },
  {
    q: "Can my agent still get things wrong?",
    a: "Yes. Retrieval grounds the facts; the reasoning is still the agent's. That's why every answer carries its source: so a wrong answer is checkable instead of invisible.",
  },
  {
    q: "Does the ATO endorse this?",
    a: "No. ato-mcp is independent and is not affiliated with, or endorsed by, the Australian Taxation Office. It retrieves the ATO's published material and always shows you where an answer came from.",
  },
  {
    q: "What's a citation worth if I can't read tax law?",
    a: "Quite a lot: hand it to your accountant. A question with the ruling attached is a shorter, cheaper conversation than a question alone.",
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
      { name: "Can you trust AI with your tax?", path: "/blog/can-you-trust-ai-with-your-tax" },
    ]),
  ],
};

export default function AiPost() {
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
          Can you trust AI with your tax?
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
              The confident answer problem
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Ask an AI about claiming your working-from-home hours and
              there&apos;s a decent chance it tells you about the 80 cents an
              hour shortcut method. Delivered warmly, formatted nicely,
              completely gone:{" "}
              <Cite href="https://www.ato.gov.au/forms-and-instructions/shortcut-method">
                that method ended on 30 June 2022
              </Cite>
              .
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              It isn&apos;t lying. A model&apos;s knowledge froze on the day
              its training data was collected, and tax refuses to hold still.
              The cents per kilometre rate was 85 cents, then 88. The{" "}
              <Cite href="https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/depreciation-and-capital-expenses-and-allowances/simpler-depreciation-for-small-business/instant-asset-write-off">
                instant asset write-off
              </Cite>{" "}
              has been $20,000, $25,000, $30,000 and $150,000 inside a single
              decade. Whatever year your chatbot memorised, it answers from
              that year forever. Even the ATO has warned that AI answers can
              draw on outdated or overseas sources.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              For most topics, stale is a shrug. For the numbers on your tax
              return, stale is a problem.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Grounding changes where answers come from
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              ato-mcp doesn&apos;t make your agent smarter. It changes what
              the answer is made of. Connected over MCP, your agent stops
              reciting from memory and starts reading: 34,500+ ATO documents,
              the income tax and GST Acts and 4,900+ public rulings, rebuilt
              monthly, with rates and thresholds stored per year.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              So ask about the shortcut method now and the answer becomes:
              that ended in 2022; for 2025-26 the{" "}
              <Cite href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/working-from-home-expenses/fixed-rate-method">
                fixed rate is 70 cents an hour
              </Cite>
              , and here is the guideline that says so. Same agent. Same
              question. Different place the answer comes from.
            </p>
            <div className="tile mt-6 flex items-center justify-center p-6 sm:p-10">
              <AiAnswersGraphic className="h-auto w-full max-w-[320px]" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              The test you can run yourself
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              You don&apos;t have to take a website&apos;s word for any of
              this, which is rather the point. Connect, then ask your agent
              something with a date-shaped edge: what&apos;s the instant asset
              write-off limit this year? Can I still use the shortcut method?
              What&apos;s the cents per kilometre rate? Watch it check instead
              of remember. Every answer comes back with the section, the
              ruling or the ATO page it stands on, and the links go to
              ato.gov.au and the legislation, not to a summary of a summary.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              If a citation looks wrong, you can click it and find out. That
              sentence is the entire trust model.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Where the judgement stays human
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Grounding fixes the facts; it doesn&apos;t finish the thinking.
              Your agent still does the reasoning, and reasoning can still
              miss. None of it is tax advice, and material decisions still
              belong with a registered tax agent. What changes is what you
              hand them: not &quot;the AI said so&quot;, but the source it
              said it from.
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
