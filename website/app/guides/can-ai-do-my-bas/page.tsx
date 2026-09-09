import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { Cite } from "@/app/blog/cite";
import { ClosingCta } from "@/components/site/ClosingCta";

export const metadata: Metadata = {
  title: "Can AI do your BAS?",
  description:
    "AI can prepare your BAS: which labels apply, what evidence to gather and when it's due, with the ATO source behind each line. Lodging stays with you.",
  alternates: { canonical: "/guides/can-ai-do-my-bas" },
};

/* ---------------------------------------------------------------------------
   /guides/can-ai-do-my-bas — a reference guide (not a blog story): direct
   answers under question-form headings, a real due-dates table, every
   figure cited. Targets "can AI do my BAS" queries.
--------------------------------------------------------------------------- */

const QUARTERS = [
  { q: "Quarter 1", months: "July, August and September", due: "28 October" },
  { q: "Quarter 2", months: "October, November and December", due: "28 February" },
  { q: "Quarter 3", months: "January, February and March", due: "28 April" },
  { q: "Quarter 4", months: "April, May and June", due: "28 July" },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Can the agent lodge my BAS for me?",
    a: "No. ato-mcp prepares: it builds the checklist, explains the labels and cites the ATO source behind each line. Lodgment happens in myGov, Online services for business, your accounting software or through your BAS agent.",
  },
  {
    q: "Do I get more time if I lodge online or through an agent?",
    a: "Usually. Lodging online can add two extra weeks to quarterly due dates, and registered tax or BAS agents have their own lodgment programs. The quarter 2 due date already includes a one-month extension, so no further online extension applies to it.",
  },
  {
    q: "Is this tax advice?",
    a: "No. ato-mcp is information infrastructure: it retrieves published ATO material and runs fixed, cited calculations. It does not consider your full circumstances and it is not a registered tax or BAS agent service. Verify material decisions with a registered agent.",
  },
  {
    q: "Which AI agents work with it?",
    a: "Anything that speaks MCP: Claude Code, Claude Desktop, ChatGPT, Codex, Gemini CLI, Cursor and VS Code all connect to the same endpoint with a browser sign-in.",
  },
];

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    breadcrumbJsonLd([{ name: "Can AI do my BAS", path: "/guides/can-ai-do-my-bas" }]),
  ],
};

const linkCls =
  "text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900";

export default function CanAiDoMyBasPage() {
  return (
    <>
      <main className="mx-auto min-h-screen max-w-5xl px-5 pb-24 pt-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
        />
        <div className="mx-auto max-w-3xl space-y-10">
          <div className="space-y-4">
            <h1 className="reveal-lcp text-[clamp(2rem,4vw,2.75rem)] font-normal leading-[1.08] tracking-tight2 text-zinc-900">
              Can AI do your BAS?
            </h1>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              AI can prepare, not lodge. An agent connected to ato-mcp builds a
              cited checklist for your reporting period: which labels apply,
              what to gather for each and when it&apos;s due, with the ATO page
              behind every line. You (or your BAS agent) still review the
              numbers and lodge.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              When is your BAS due?
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Most small businesses report quarterly. The{" "}
              <Cite href="https://www.ato.gov.au/businesses-and-organisations/preparing-lodging-and-paying/business-activity-statements-bas/due-dates-for-lodging-and-paying-your-bas">
                standard due dates
              </Cite>{" "}
              are:
            </p>
            <div className="card overflow-hidden p-0">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="eyebrow px-4 py-2.5 text-left">Quarter</th>
                    <th className="eyebrow px-4 py-2.5 text-left">Months covered</th>
                    <th className="eyebrow px-4 py-2.5 text-left">Due date</th>
                  </tr>
                </thead>
                <tbody>
                  {QUARTERS.map((row, idx) => (
                    <tr key={row.q} className={idx % 2 === 1 ? "bg-zinc-50/70" : "bg-white"}>
                      <td className="px-4 py-2 text-[13px] text-zinc-900">{row.q}</td>
                      <td className="px-4 py-2 text-[13px] text-zinc-500">{row.months}</td>
                      <td className="px-4 py-2 font-mono text-xs text-zinc-900">{row.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Lodging online can add two extra weeks, except for quarter 2,
              whose due date already includes a one-month extension.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What goes on a Simpler BAS?
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              If your GST turnover is under $10 million you use{" "}
              <Cite href="https://www.ato.gov.au/businesses-and-organisations/preparing-lodging-and-paying/business-activity-statements-bas/goods-and-services-tax-gst/gst-reporting-methods">
                Simpler BAS
              </Cite>
              , which needs three GST labels:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-zinc-700">
              <li>
                <Cite href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/in-detail/managing-gst-in-your-business/reporting-paying-and-activity-statements/completing-your-bas-for-gst/complete-your-bas/step-1-sales">
                  G1: total sales
                </Cite>{" "}
                for the period.
              </li>
              <li>1A: GST you collected on those sales.</li>
              <li>
                1B: GST credits on business purchases (some purchases{" "}
                <Cite href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/claiming-gst-credits/when-you-cannot-claim-a-gst-credit">
                  don&apos;t qualify
                </Cite>
                ).
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Do you even need to lodge one?
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Only if you&apos;re registered for GST.{" "}
              <Cite href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst">
                Registration becomes mandatory
              </Cite>{" "}
              once your GST turnover reaches $75,000 ($150,000 for
              non-profits), or from day one if you drive taxis or do
              ride-sourcing, regardless of turnover.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What does the agent actually do?
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Connected to ato-mcp, your agent calls bas_prep_checklist: a
              deterministic tool that reads your saved tax profile (reporting
              period, GST registration, structure) and returns a tiered
              checklist for the quarter: the labels that apply to you, the
              evidence to gather for each, the gotchas people hit, and the ATO
              source cited on every line. It prepares; you lodge.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              The questions everyone asks
            </h2>
            <div className="space-y-5">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <h3 className="text-[15px] font-medium text-zinc-900">{f.q}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-zinc-700">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3 border-t border-zinc-100 pt-8">
            <p className="text-sm text-zinc-500">
              Related reading:{" "}
              <Link href="/blog/its-bas-time-again" className={linkCls}>
                It&apos;s BAS time again
              </Link>{" "}
              and{" "}
              <Link href="/guides/ai-agent-tax-deductions" className={linkCls}>
                Can an AI agent find your tax deductions?
              </Link>
            </p>
          </section>
        </div>
      </main>
      <ClosingCta />
    </>
  );
}
