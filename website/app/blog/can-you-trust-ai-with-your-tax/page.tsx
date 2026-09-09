import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { BLOG_POSTS } from "../posts";
import { AiAnswersGraphic } from "../graphics";
import { blogPostingJsonLd, postMetadata } from "../seo";
import { ClosingCta } from "@/components/site/ClosingCta";

const POST = BLOG_POSTS.find((p) => p.slug === "can-you-trust-ai-with-your-tax")!;

const SEO = {
  title: "Spreadsheet vs crew management app for dragon boat",
  description:
    "Shared sheets drift, wrong tabs get edited, race morning doesn't match the file. Why a dedicated crew tool beats the spreadsheet that never quite matches the pontoon.",
};

export const metadata: Metadata = postMetadata(POST, SEO);

/* ---------------------------------------------------------------------------
   /blog/can-you-trust-ai-with-your-tax — spreadsheets vs purpose-built roster
   tools: the confident wrong tab, why drift happens, what changes, FAQ.
--------------------------------------------------------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "Our Google Sheet works fine — why switch?",
    a: "If it works, keep it. Switch when you've had a wrong-heat edit, a version nobody trusts, or a coach rebuilding from memory every regatta. That's the usual trigger.",
  },
  {
    q: "Can we export from a spreadsheet?",
    a: "Most clubs start in a sheet. Paddltir expects you to enter paddlers once — name, side, weight — then seat in a layout built for boats, not cells.",
  },
  {
    q: "What goes wrong with shared sheets?",
    a: "Wrong tab edited, sort breaks seat order, someone adds a row and formulas silently fail, three copies after a regatta and nobody knows which was final.",
  },
  {
    q: "Do we need an app if we only race twice a year?",
    a: "Maybe not. If you race often or run multiple heats, the cost of one bad lineup usually exceeds the cost of a proper tool.",
  },
  {
    q: "Who can see the lineup on race day?",
    a: "Share read-only with paddlers if your tool supports it. Coaches edit; crew confirms seat numbers — fewer dock arguments.",
  },
  {
    q: "Is Paddltir only for big clubs?",
    a: "No. Small crews benefit most from not re-inventing the lineup every time. One roster, saved layouts, less dependence on whoever coached last year.",
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
      { name: POST.title, path: "/blog/can-you-trust-ai-with-your-tax" },
    ]),
  ],
};

export default function SpreadsheetPost() {
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
              The confident wrong tab
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Every club has a spreadsheet. Tabs for each heat, colours for
              sides, maybe a formula summing weight if someone stayed up late.
              It worked until someone edited Mixed 200m while thinking they
              were in Open 500m, or sorted by name and destroyed seat order,
              or opened last season&apos;s copy by mistake.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Spreadsheets are general-purpose. Race morning is not. You need
              boat-shaped layout, side totals that move when you drag a name,
              and one source of truth the whole committee can open without
              breaking a macro.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What a crew tool changes
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Paddltir isn&apos;t smarter than your sheet. It&apos;s narrower.
              Paddlers live in a roster with side and weight. Lineups are
              per heat, drawn on a boat diagram. Change seat 7 and the
              left-right tally updates — no SUMIF range to maintain.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Same committee, same people. Different shape for the job: less
              &quot;which file is live?&quot;, more &quot;load the boat.&quot;
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
              Next regatta, ask: did the dock match the sheet? Did anyone
              re-seat from memory? Was there a version saved as
              &quot;FINAL_v3_REAL&quot;? If yes to any of that, your tool is
              costing you time whether or not the subscription does.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Try seating one heat in{" "}
              <Link href="/app" className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900">
                Paddltir
              </Link>{" "}
              alongside the sheet. If the layout feels obvious and the totals
              match what you eyeball, you have your answer.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Where judgement stays human
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Software doesn&apos;t pick your race plan or know who&apos;s
              carrying a shoulder. It holds the lineup so you can argue about
              strategy, not arithmetic. The coach still decides; the tool
              just stops the record from lying.
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
