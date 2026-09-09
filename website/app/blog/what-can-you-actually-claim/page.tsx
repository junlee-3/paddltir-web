import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { BLOG_POSTS } from "../posts";
import { DeductionsGraphic } from "../graphics";
import { Cite } from "../cite";
import { blogPostingJsonLd, postMetadata } from "../seo";
import { ClosingCta } from "@/components/site/ClosingCta";

const POST = BLOG_POSTS.find((p) => p.slug === "what-can-you-actually-claim")!;

const SEO = {
  title: "Sole trader deductions with an AI agent",
  description:
    "Ask your agent what you can claim as a sole trader and get answers grounded in 34,500+ ATO documents, with the citation attached. Current for the 2025-26 income year.",
};

export const metadata: Metadata = postMetadata(POST, SEO);

/* ---------------------------------------------------------------------------
   /blog/what-can-you-actually-claim — a story-shaped guide: the felt problem, the turn (ask
   your agent), Maya's session with real 2025-26 figures, what changes, FAQ.
--------------------------------------------------------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "Can my agent see my expenses or bank accounts?",
    a: "No. ato-mcp reads a tax profile of about 25 fields you save (business structure, GST registration and so on), nothing else. You describe your spending in the conversation; the tool matches it to ATO deduction categories and returns the sources.",
  },
  {
    q: "Will it tell me exactly how much to claim?",
    a: "No. It returns the categories that fit your situation, the records each one needs and the ATO source behind it. You and your agent work out amounts from your own records, and material decisions still belong with a registered tax agent.",
  },
  {
    q: "Is it true I can claim $300 without receipts?",
    a: "Only for employee work expenses. That threshold lives in the substantiation rules for salary and wage earners and doesn't stretch to sole trader business deductions, which need records in full. Plenty of pages get this wrong; it's exactly the kind of detail a cited answer protects you from.",
  },
  {
    q: "What records do I need?",
    a: "Receipts or invoices for what you spent, a record of actual hours for the whole year if you use the working-from-home fixed rate (an estimate no longer cuts it), and a logbook if you claim actual car costs. Keep everything for five years. Ask your agent what a category needs and it will quote the requirement with the source.",
  },
  {
    q: "Is it current for the 2025-26 income year?",
    a: "Yes. The corpus is rebuilt monthly and thresholds are stored per year, so rates like the 70 cents per hour fixed rate and 88 cents per kilometre come back for the year you ask about, not the year a model was trained.",
  },
  {
    q: "I have a day job and freelance on the side. Does that work?",
    a: "Yes. Employee work expenses and sole trader business deductions are different categories with different rules, and the tool surfaces both sides based on your profile.",
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
      { name: "Find your deductions", path: "/blog/what-can-you-actually-claim" },
    ]),
  ],
};

export default function DeductionsPost() {
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
          What can you actually claim?
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
              The three answers everyone knows
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Ask around and you&apos;ll hear the same three: home office,
              laptop, maybe the car. So that&apos;s what you claim. You lodge,
              you get the refund, and some quiet part of you spends the next
              year wondering what you left behind.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Here&apos;s the thing: the real list is longer and more ordinary
              than you&apos;d expect. The law is roughly one sentence: if you
              spent it to earn your business income, you can generally deduct
              it (<Cite href="https://www.legislation.gov.au/C2004A05138/latest/text">ITAA 1997 s 8-1</Cite>).
              The software subscriptions. The insurance.
              The fee you paid to get last year&apos;s tax done. The problem
              was never the principle. The problem is that the detail lives
              across thousands of ATO pages, and nobody has an evening for
              that.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              So you ask your agent instead
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              You type the question the way you&apos;d say it out loud: what
              can I actually claim? No forms, no dropdown asking for your
              industry code. Your agent already knows the shape of your year,
              because you saved a profile once: sole trader, GST-registered,
              spare room, car.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Then it does the thing a friend can&apos;t. It walks a
              59-category map built from ATO guidance and keeps everything that
              fits how you actually work. The occupation-specific rules for
              what you do. The category you didn&apos;t know had a name. The
              ones the ATO is watching this year, sorted to the top so you know
              where the receipts matter most.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              And next to every single one: the source. Not &quot;trust
              me&quot;. The section, the ruling, the page.
            </p>
            <div className="tile mt-6 flex items-center justify-center p-6 sm:p-10">
              <DeductionsGraphic className="h-auto w-full max-w-[320px]" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Maya&apos;s evening
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Maya designs brand identities from the spare room of a Brisbane
              apartment. Late June, laptop open, receipts within arm&apos;s
              reach. She gives her agent three sentences about her year and
              asks the question.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              It comes back with the map. Her 1,480 hours at home are worth
              $1,036 under the{" "}
              <Cite href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/working-from-home-expenses/fixed-rate-method">
                fixed rate
              </Cite>{" "}
              (70 cents an hour for 2025-26, and it wants her to know an
              estimate of hours won&apos;t cut it: the ATO expects a record of
              the actual ones). The $2,399 laptop can be{" "}
              <Cite href="https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/depreciation-and-capital-expenses-and-allowances/simpler-depreciation-for-small-business/instant-asset-write-off">
                written off in full
              </Cite>{" "}
              this year. The 2,100 km of driving to client sites comes to
              $1,848 at{" "}
              <Cite href="https://www.ato.gov.au/tax-and-super-professionals/for-tax-professionals/prepare-and-lodge/tax-time/tax-time-toolkits/tax-time-toolkit-small-business/small-business-guides/motor-vehicle-expenses">
                88 cents a kilometre
              </Cite>
              , no logbook needed under 5,000. The design software, the income
              protection premiums: on the list, with the source beside each.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Maya is made up. The rates and sections are real for 2025-26,
              and that&apos;s rather the point: every line arrives with the
              ATO page behind it, so when her accountant asks where a number
              came from, the answer is a link, not a shrug.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              The part that actually changes things
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              It isn&apos;t the speed, although the speed is nice. It&apos;s
              that you stop acting on &quot;probably&quot;. Probably I can
              claim this. Probably that rule still exists. An agent on its own
              is confident; an agent with ato-mcp is checkable, and for tax
              those are different things entirely.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              None of it is tax advice, and it doesn&apos;t pretend to be.
              When a decision is material, you still take it to a registered
              tax agent. You just arrive with the citations instead of the
              question.
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
