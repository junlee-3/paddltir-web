import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { Cite } from "@/app/blog/cite";
import { ClosingCta } from "@/components/site/ClosingCta";

export const metadata: Metadata = {
  title: "Can AI find your tax deductions?",
  description:
    "Can an AI agent find your tax deductions? What a connected agent can do for a sole trader in 2025-26: cited categories, records, honest limits.",
  alternates: { canonical: "/guides/ai-agent-tax-deductions" },
};

/* ---------------------------------------------------------------------------
   /guides/ai-agent-tax-deductions — a reference guide (not a blog story):
   direct answers under question-form headings, extractable lists, every
   figure cited. Targets "AI agent Australian tax deductions" queries.
--------------------------------------------------------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is this tax advice?",
    a: "No. ato-mcp is information infrastructure: it retrieves published ATO material and runs fixed, cited calculations. It does not consider your full circumstances and it is not a registered tax agent service. Verify material decisions with a registered tax agent.",
  },
  {
    q: "Which AI agents can find deductions this way?",
    a: "Anything that speaks MCP: Claude Code, Claude Desktop, ChatGPT, Codex, Gemini CLI, Cursor and VS Code all connect to the same endpoint. The agent you already use asks the questions; ato-mcp supplies the cited tax knowledge.",
  },
  {
    q: "Does the agent see my bank account or receipts?",
    a: "No. ato-mcp reads a tax profile of about 25 fields you save (business structure, GST registration and so on), nothing else. You describe your spending in the conversation; the tool matches it to deduction categories and returns the sources.",
  },
  {
    q: "How current are the answers?",
    a: "The corpus is rebuilt monthly from ato.gov.au, the Federal Register of Legislation and law.ato.gov.au, and withdrawn rulings are flagged. Every passage carries its publication date, so the agent can prefer current guidance and say which year a rate belongs to.",
  },
];

const SITE = "https://ato-mcp.com.au";

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
    breadcrumbJsonLd([
      { name: "AI agent for tax deductions", path: "/guides/ai-agent-tax-deductions" },
    ]),
  ],
};

const linkCls =
  "text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900";

export default function AiAgentTaxDeductionsPage() {
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
              Can an AI agent find your tax deductions?
            </h1>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Yes, with a caveat. An AI agent connected to cited retrieval over
              34,500+ ATO documents can map the deduction categories that fit
              how you work, show the ATO source for each and list the records
              you need. It cannot lodge for you, and amounts stay your
              decision.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What can a sole trader usually claim?
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              The general rule sits in{" "}
              <Cite href="https://www.legislation.gov.au/C2004A05138/latest/text">
                section 8-1 of the ITAA 1997
              </Cite>
              : expenses you incur in earning your business income, to the
              extent they are not private or capital. For 2025-26 the common
              categories are:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-zinc-700">
              <li>
                Home office running costs: the{" "}
                <Cite href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/working-from-home-expenses/fixed-rate-method">
                  fixed-rate method
                </Cite>{" "}
                allows 70 cents per work hour for 2025-26, or you can claim the
                work share of actual costs with records.
              </li>
              <li>
                Tools and equipment: business assets are depreciated, and for
                2025-26 assets under $20,000 could be deducted in full under
                the{" "}
                <Cite href="https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/depreciation-and-capital-expenses-and-allowances/simpler-depreciation-for-small-business/instant-asset-write-off">
                  instant asset write-off
                </Cite>{" "}
                (the 2026-27 threshold is not yet legislated).
              </li>
              <li>
                Motor vehicle and travel:{" "}
                <Cite href="https://www.ato.gov.au/tax-and-super-professionals/for-tax-professionals/prepare-and-lodge/tax-time/tax-time-toolkits/tax-time-toolkit-small-business/small-business-guides/motor-vehicle-expenses">
                  cents per kilometre or logbook
                </Cite>
                , for the business share of vehicle use.
              </li>
              <li>
                Phone, internet and software: the portion used for the
                business, apportioned on a reasonable basis.
              </li>
              <li>
                Insurance, professional fees, bank fees and subscriptions
                connected to earning your business income.
              </li>
            </ul>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Which of these actually apply, and what evidence each needs,
              depends on your structure and how you operate. That matching is
              the part an agent does well.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What does the agent actually do when you ask?
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Connected to ato-mcp, your agent calls deduction_discovery: a
              deterministic tool that walks a curated map of deduction
              categories built from ATO guidance, matched to the tax profile
              you saved once (sole trader or company, GST registered or not,
              home based or not). It returns the categories that plausibly
              apply, confidence-rated, with the records each one needs and the
              ATO source cited on every line. You read the sources, not the
              model&apos;s memory.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What won&apos;t it do?
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              It won&apos;t lodge your return, decide amounts, or tell you to
              claim something. It surfaces categories, rules and sources; the
              numbers come from your records, and material decisions still
              belong with a registered tax agent. The difference is you arrive
              with the citations instead of the question.
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
              <Link href="/blog/what-can-you-actually-claim" className={linkCls}>
                What can you actually claim?
              </Link>
              ,{" "}
              <Link href="/blog/so-you-bought-a-laptop-in-the-eofy-sales" className={linkCls}>
                So you bought a laptop in the EOFY sales
              </Link>{" "}
              and{" "}
              <Link href="/guides/can-ai-do-my-bas" className={linkCls}>
                Can AI do your BAS?
              </Link>
            </p>
          </section>
        </div>
      </main>
      <ClosingCta />
    </>
  );
}
