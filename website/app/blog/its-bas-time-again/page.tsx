import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { BLOG_POSTS } from "../posts";
import { BasGraphic } from "../graphics";
import { Cite } from "../cite";
import { blogPostingJsonLd, postMetadata } from "../seo";
import { ClosingCta } from "@/components/site/ClosingCta";

const POST = BLOG_POSTS.find((p) => p.slug === "its-bas-time-again")!;

const SEO = {
  title: "Prepare your BAS with an AI agent, cited",
  description:
    "Ask your agent what goes on your BAS, when it's due and what to gather for each label, with the ATO source behind every line. Grounded in 34,500+ ATO documents.",
};

export const metadata: Metadata = postMetadata(POST, SEO);

/* ---------------------------------------------------------------------------
   /blog/its-bas-time-again — a story-shaped guide: the quarterly ritual, the turn (bring
   your agent), Sam's September quarter with real figures, what it won't do.
--------------------------------------------------------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "Can my agent lodge the BAS for me?",
    a: "No. It prepares: which labels apply, what to gather for each, due dates, all cited. You lodge through Online services for business, myGov or a registered agent. Keeping lodgment in your hands is deliberate.",
  },
  {
    q: "Does it calculate my GST for me?",
    a: "The checklist tool structures what to gather rather than doing sums, so nothing depends on records it can't see. Give your agent the quarter's figures in the conversation and it can do the arithmetic, with the label definitions cited.",
  },
  {
    q: "Do I need to lodge if I made no sales?",
    a: "Yes. A nil activity statement is still due by the same date, and skipping it is one of the most common ways a small business collects a penalty for a quarter in which it earned nothing. Lodging nil takes minutes online.",
  },
  {
    q: "I made a mistake on a BAS I already lodged",
    a: "Breathe. Small GST errors can usually be corrected on a later BAS, within limits the ATO publishes; larger ones need a revision of the original statement. The limits depend on your turnover, which your agent can look up for your situation, cited.",
  },
  {
    q: "I report monthly. Does it still work?",
    a: "Yes. The checklist is built from your reporting period: monthly BAS due the 21st of the following month, quarterly with the statutory dates, or the annual GST return, which is generally due with your income tax return.",
  },
  {
    q: "What about PAYG withholding, FBT or fuel tax credits?",
    a: "Sections for PAYG withholding (W1, W2), FBT instalments, fuel tax credits, even wine equalisation and luxury car tax, appear when your profile or the conversation says they apply. If they don't apply, you never see them.",
  },
  {
    q: "I'm behind on a few BAS. Where do I start?",
    a: "The ATO's guidance on overdue lodgment, nil statements and payment plans is in the corpus too, so your agent can walk you through what applies, cited. For debts and penalties, talk to the ATO or a registered agent early rather than waiting.",
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
      { name: "Prepare your BAS", path: "/blog/its-bas-time-again" },
    ]),
  ],
};

export default function BasPost() {
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
          It&apos;s BAS time again
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
              The dance you know by heart
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Nobody warns you about this part when you get an ABN. Four times
              a year, a form arrives with its own vocabulary: G1, 1A, 1B,
              labels that sound like droids. You&apos;ve googled &quot;what
              goes at G1&quot; so many times the search bar finishes the
              sentence for you.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              The form itself is smaller than the dread. If you&apos;re like
              most small businesses you&apos;re on{" "}
              <Cite href="https://www.ato.gov.au/businesses-and-organisations/preparing-lodging-and-paying/business-activity-statements-bas/goods-and-services-tax-gst/gst-reporting-methods">
                Simpler BAS
              </Cite>
              , which is three numbers: everything you sold (G1), the GST you
              collected (1A), and the GST credits on what you bought (1B). The
              dread lives at the edges: which sales count, which purchases
              qualify, and what happens if you get it wrong.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              This time, you bring your agent
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              You say: help me get my BAS together. That&apos;s the whole
              prompt. Your profile already carries the answers to the boring
              questions: GST-registered, quarterly, no employees.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              What comes back is your checklist, not a brochure. The three
              labels that apply to you, what to gather for each, and the traps
              placed exactly where people fall into them:{" "}
              <Cite href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/in-detail/managing-gst-in-your-business/reporting-paying-and-activity-statements/completing-your-bas-for-gst/complete-your-bas/step-1-sales">
                G1 includes your GST-free sales
              </Cite>{" "}
              too. That $90 purchase{" "}
              <Cite href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/claiming-gst-credits/when-you-cannot-claim-a-gst-credit">
                needs a tax invoice
              </Cite>
              . A nil quarter still has to be lodged. And every line carries
              the ATO page it came from, one click away.
            </p>
            <div className="tile mt-6 flex items-center justify-center p-6 sm:p-10">
              <BasGraphic className="h-auto w-full max-w-[320px]" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Sam&apos;s September quarter
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Sam builds websites. The quarter&apos;s books: $22,000 invoiced
              and paid, $3,300 of business purchases with the invoices to show
              for it. His agent walks it through: $22,000 at G1, the $2,000 of
              GST inside it at 1A, $300 of credits at 1B. $1,700 to pay,{" "}
              <Cite href="https://www.ato.gov.au/businesses-and-organisations/preparing-lodging-and-paying/business-activity-statements-bas/due-dates-for-lodging-and-paying-your-bas">
                due 28 October
              </Cite>
              , a few weeks later if he lodges through an agent.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              One catch gets flagged before he can step on it: Sam reports on
              a cash basis, so the September invoice that gets paid in October
              belongs to next quarter, not this one. That single sentence is
              one of the most common BAS mistakes in the country, settled in
              seconds with the source attached.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Sam is made up. The labels, the arithmetic and the due date are
              real.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What it won&apos;t do
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              It won&apos;t lodge for you, and it won&apos;t guess your
              liability from records it can&apos;t see. That&apos;s
              deliberate: the checklist is built from published ATO guidance
              and your saved profile, and lodging stays in your hands, through
              Online services or your agent. None of it is tax advice. It just
              makes the preparation the easy part, and if something material
              comes up, you take it to a registered tax or BAS agent with the
              citations already in hand.
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
