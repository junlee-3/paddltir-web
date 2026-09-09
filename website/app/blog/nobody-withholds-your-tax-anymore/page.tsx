import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { BLOG_POSTS } from "../posts";
import { AbnGraphic } from "../graphics";
import { Cite } from "../cite";
import { blogPostingJsonLd, postMetadata } from "../seo";
import { ClosingCta } from "@/components/site/ClosingCta";

const POST = BLOG_POSTS.find((p) => p.slug === "nobody-withholds-your-tax-anymore")!;

const SEO = {
  title: "Sole trader tax basics for your first year with an ABN",
  description:
    "Your first freelance invoice arrives whole: no tax withheld. What changes with an ABN: income tax, PAYG instalments and the $75,000 GST threshold, cited.",
};

export const metadata: Metadata = postMetadata(POST, SEO);

/* ---------------------------------------------------------------------------
   /blog/nobody-withholds-your-tax-anymore — a story-shaped guide: the first whole invoice, the catch, the
   three things that change, Jess's day-one question, the habit.
--------------------------------------------------------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "How much should I put aside from each invoice?",
    a: "There's no single number: it depends on your total income, the tax-free threshold, the Medicare levy and whether GST applies to you. Ask your agent to lay out the current rates with sources and work it through, and for real stakes, confirm with a registered tax agent.",
  },
  {
    q: "When do PAYG instalments actually start?",
    a: "Usually after you lodge your first return with instalment income above the entry threshold: the ATO enters you automatically and writes to tell you. You can also enter voluntarily earlier to smooth out the first year.",
  },
  {
    q: "Do I need to register for GST from day one?",
    a: "Not until your current or projected turnover reaches $75,000; then you have 21 days. Registering earlier is optional and occasionally useful, and it brings BAS lodgment along with it.",
  },
  {
    q: "Can I claim deductions in my first year?",
    a: "From day one: expenses you incur earning your business income are generally deductible, from the laptop to the software subscriptions. The deductions guide on this blog walks it properly.",
  },
  {
    q: "Do I still lodge just one tax return?",
    a: "Yes. As a sole trader your business income and deductions go into your individual return with a business schedule. Companies and trusts are different animals with their own returns.",
  },
  {
    q: "What records should I start keeping now?",
    a: "Invoices out, receipts in, hours if you work from home, kilometres if you drive for work. Keep them for five years. Future-you will be grateful, again.",
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
      { name: "Your first year with an ABN", path: "/blog/nobody-withholds-your-tax-anymore" },
    ]),
  ],
};

export default function AbnPost() {
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
          Nobody withholds your tax anymore
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
              The miracle has a catch
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              When you were employed, tax happened to you. An employer withheld
              it before you ever saw it, and the return each July was mostly a
              formality. The ABN ends that arrangement quietly and completely:
              nobody withholds anything now, but the income tax is still real,
              still accruing with every invoice, and still due after you
              lodge.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              That&apos;s the whole trap of the first year. Nothing feels
              wrong until the first tax bill arrives, and by then the money
              has a way of having been spent.
            </p>
            <div className="tile mt-6 flex items-center justify-center p-6 sm:p-10">
              <AbnGraphic className="h-auto w-full max-w-[320px]" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              The three things that actually change
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              First, income tax becomes your job. You still get the{" "}
              <Cite href="https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/tax-free-threshold/how-to-claim-the-tax-free-threshold">
                tax-free threshold
              </Cite>{" "}
              ($18,200), and above it your business profit is taxed like any
              other income, just with nobody collecting as you go.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Second, after your first return with business income above the
              entry threshold, the ATO typically enters you into{" "}
              <Cite href="https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/payg-instalments/starting-payg-instalments">
                PAYG instalments
              </Cite>
              : quarterly prepayments so the bill never balloons like that
              again. You&apos;ll get a letter. It&apos;s help, not punishment.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Third, GST stays off your plate entirely until your turnover
              reaches $75,000, current or projected, at which point you have{" "}
              <Cite href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst">
                21 days to register
              </Cite>
              . Until then, no GST on your invoices and no BAS to lodge.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Jess asks on day one
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Jess left her marketing job in August and invoiced $4,400 in her
              first month. Her question isn&apos;t sophisticated, and
              that&apos;s the point: I just went freelance, what do I need to
              do for tax?
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Her agent, reading her saved profile, walks the year ahead: the
              return she&apos;ll lodge, the instalments that will likely
              follow it, the GST threshold she doesn&apos;t need to think
              about yet at her pace, and the deductions that start counting
              from day one (the laptop, the software, the co-working desk).
              Each line lands with the ATO page behind it, so the answer to
              &quot;says who?&quot; is always one click.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Jess is made up. The thresholds, the instalment system and the
              21 days are real.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Start the habit before the bill
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              The single kindest thing you can do for future-you is open a
              second account and move a slice of every invoice into it from
              the start. How big a slice depends on your bracket and your
              circumstances, which is exactly the kind of question to put to
              your agent with the current rates in front of it, or to a
              registered tax agent if the stakes are real. The habit matters
              more than the precision. July-you will want to buy August-you a
              drink.
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
