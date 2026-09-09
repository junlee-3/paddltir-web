import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { BLOG_POSTS } from "../posts";
import { AuditGraphic } from "../graphics";
import { Cite } from "../cite";
import { blogPostingJsonLd, postMetadata } from "../seo";
import { ClosingCta } from "@/components/site/ClosingCta";

const POST = BLOG_POSTS.find((p) => p.slug === "am-i-going-to-get-audited")!;

const SEO = {
  title: "Check your audit risk with an AI agent, cited",
  description:
    "Ask your agent to check your draft return against the risk areas the ATO publishes: banded, explained and cited, before you lodge. Grounded in 34,500+ ATO documents.",
};

export const metadata: Metadata = postMetadata(POST, SEO);

/* ---------------------------------------------------------------------------
   /blog/am-i-going-to-get-audited — a story-shaped guide: the fear after lodging, the turn
   (check before you lodge), Priya's ten minutes, what a flag is and isn't.
--------------------------------------------------------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "What does the audit risk check actually look at?",
    a: "Around 13 red flags drawn from published ATO guidance: income completeness against what's typically pre-filled, deductions out of proportion to your occupation and income, and claims in areas the ATO has flagged publicly. Each result carries the guidance behind it.",
  },
  {
    q: "Can it tell me my real chance of being audited?",
    a: "No, and be suspicious of anything that says it can: the ATO doesn't publish its selection systems. The check reads your draft against public guidance, which is the part you can actually control.",
  },
  {
    q: "Does a low band mean I'm safe?",
    a: "It means nothing in your draft contradicts the published guidance it checks against. Keep your records anyway: five years, receipts, and the hours or kilometres behind any rate-based claim.",
  },
  {
    q: "Does using AI to prepare my tax increase audit risk?",
    a: "Your lodgment looks the same however you prepared it. What matters is whether the claims are right and substantiated, and cited answers make both of those easier, not harder.",
  },
  {
    q: "I found a mistake in a return I already lodged",
    a: "You can request an amendment, and raising it yourself early is far better than waiting for a letter. Your agent can walk the amendment process with the ATO page behind it; for anything material, bring in a registered tax agent.",
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
      { name: "Check your audit risk", path: "/blog/am-i-going-to-get-audited" },
    ]),
  ],
};

export default function AuditPost() {
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
          Am I going to get audited?
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
              The fear that outlasts the refund
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Almost everyone who does their own tax carries a version of it.
              Not guilt, exactly. You didn&apos;t invent deductions. You just
              weren&apos;t sure, twice, and you rounded up once, and now the
              word &quot;audit&quot; has a permanent corner of your brain.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Here&apos;s what the fear gets wrong: the ATO isn&apos;t peering
              through your window. It&apos;s reading your data. Banks,
              employers, health funds and government agencies send your numbers
              in{" "}
              <Cite href="https://www.ato.gov.au/individuals-and-families/your-tax-return/how-to-lodge-your-tax-return/lodge-your-tax-return-online-with-mytax/pre-filling-your-online-tax-return">
                before you&apos;ve opened myTax
              </Cite>{" "}
              (that&apos;s what pre-fill is). So the fastest way to draw
              attention isn&apos;t a big claim. It&apos;s telling them
              something different from what they already know.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              So you check before you lodge
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              You say: here&apos;s my draft return, is anything in it risky?
              The audit risk check runs your numbers against around 13 red
              flags drawn from published ATO guidance: income that
              doesn&apos;t match what&apos;s been reported about you,
              deductions out of proportion to{" "}
              <Cite href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/guides-for-occupations-and-industries">
                your occupation
              </Cite>{" "}
              and income, claims in the areas the ATO has said it watches.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              What comes back isn&apos;t a verdict. It&apos;s a band (low,
              medium, high) with every flag explained and cited, so you can
              see exactly which line earned it and what the ATO actually says
              about it. Most of the time the answer is: you&apos;re fine, and
              now you know why you&apos;re fine.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              The reasons matter more than the band. A flag doesn&apos;t mean
              don&apos;t claim it. It means this is the claim to have records
              for.
            </p>
            <div className="tile mt-6 flex items-center justify-center p-6 sm:p-10">
              <AuditGraphic className="h-auto w-full max-w-[320px]" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Priya&apos;s ten minutes
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Priya photographs weddings, sole trader, second year in. Draft
              return done, one nagging doubt: her working-from-home claim
              feels big. She asks.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Two flags come back. Her interest income is missing $34 that her
              bank has already reported (a forgotten savings account, easily
              fixed). And her equipment claims are large for her income, which
              is normal for a photographer in a gear-heavy year, and exactly
              the kind of claim to have the receipts for. The band lands on
              low. She fixes the $34, checks the receipts folder, lodges, and
              gets her September back.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Priya is made up. Pre-fill, the bands and the guidance behind
              each flag are real.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What a flag is, and isn&apos;t
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              None of this predicts an audit, and be suspicious of anything
              that claims to. The check reads your draft against what the ATO
              has published, nothing more. It can&apos;t see what the
              ATO&apos;s own systems see, and it isn&apos;t tax advice. What
              it does is convert a vague background dread into a short,
              specific list: this line, this reason, this source. Dread
              doesn&apos;t have a to-do list. This does.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              And if something material surfaces, that&apos;s the moment for a
              registered tax agent, with the citations already in hand.
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
