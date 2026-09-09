import type { Metadata } from "next";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "Compare: your agent with and without ato-mcp",
  description:
    "Three ways to answer an Australian tax question: browse ato.gov.au yourself, ask a chatbot on its own, or ask your agent with ato-mcp connected. An honest comparison.",
  alternates: { canonical: "/compare" },
};

const pageJsonLd = {
  "@context": "https://schema.org",
  ...breadcrumbJsonLd([{ name: "Compare", path: "/compare" }]),
};

const ROWS: { label: string; ato: string; alone: string; mcp: string }[] = [
  {
    label: "Where answers come from",
    ato: "The published pages, if you can find the right ones",
    alone: "Training data of uncertain age, plus whatever a web search surfaces",
    mcp: "34,500+ ATO documents, the income tax and GST Acts and 4,900+ public rulings",
  },
  {
    label: "Citations",
    ato: "You are reading the source itself",
    alone: "Rarely, and links often point somewhere generic",
    mcp: "Every answer: the section, the ruling, the page",
  },
  {
    label: "How current",
    ato: "Current, if you checked the right year's page",
    alone: "Unknown; thresholds and rates go stale silently",
    mcp: "Corpus rebuilt monthly; withdrawn rulings flagged; thresholds are point-in-time",
  },
  {
    label: "Knows your situation",
    ato: "No. You translate the generic guidance yourself",
    alone: "Only what you re-type each conversation",
    mcp: "Optional tax profile (about 25 fields) read once per session",
  },
  {
    label: "Calculations",
    ato: "You, with a spreadsheet",
    alone: "Arithmetic of varying reliability",
    mcp: "Deterministic workflow tools: depreciation, deductions, BAS prep, audit risk",
  },
  {
    label: "Time for one question",
    ato: "Often an hour or more of tab-hopping",
    alone: "Seconds, but you can't act on \"probably\"",
    mcp: "Seconds, with the source attached",
  },
];

export default function ComparePage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 pb-24 pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <p className="eyebrow">Compare</p>
      <h1 className="mt-3 max-w-2xl text-[clamp(2rem,4vw,2.75rem)] font-normal leading-[1.08] tracking-tight2 text-zinc-900">
        Three ways to answer a tax question
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-500">
        Say you bought a laptop in June and want to know how to write it off.
        You can dig through ato.gov.au yourself, ask a chatbot and hope, or
        ask your agent with ato-mcp connected. Here is the honest difference.
      </p>

      {/* ----------------------------------------------- comparison table */}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" className="w-[18%] py-3 pr-4 font-medium text-zinc-400"></th>
              <th scope="col" className="w-[27%] py-3 pr-4 font-medium text-zinc-900">
                Browsing ato.gov.au yourself
              </th>
              <th scope="col" className="w-[27%] py-3 pr-4 font-medium text-zinc-900">
                Asking a chatbot on its own
              </th>
              <th scope="col" className="w-[28%] py-3 font-medium text-zinc-900">
                Your agent with ato-mcp
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.label} className="border-b border-zinc-100 align-top">
                <th scope="row" className="py-4 pr-4 font-medium text-zinc-900">
                  {r.label}
                </th>
                <td className="py-4 pr-4 leading-relaxed text-zinc-500">{r.ato}</td>
                <td className="py-4 pr-4 leading-relaxed text-zinc-500">{r.alone}</td>
                <td className="py-4 leading-relaxed text-zinc-700">{r.mcp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ----------------------------------------------- prose */}
      <div className="mt-14 max-w-3xl space-y-10">
        <section className="space-y-3">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            Browsing ato.gov.au yourself
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            The answers exist, and reading the source directly is the gold
            standard. The problem is finding them: the guidance spans
            thousands of pages, the detail lives in rulings and legislation
            that guidance pages only gesture at, and thresholds change year to
            year. For one clear question this works. For &quot;what can I
            actually claim&quot;, it becomes an afternoon.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            Asking a chatbot on its own
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            Fast, and often roughly right. But the answer comes from training
            data of uncertain vintage, thresholds drift silently out of date,
            and there is usually no citation you could hand to your
            accountant. Tax is exactly the domain where a plausible answer
            and a correct answer look identical until it costs you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            Your agent with ato-mcp
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            The same agent you already use, grounded. It searches the actual
            corpus (guidance, three Acts, rulings), reads your saved tax
            profile so answers fit your structure, runs depreciation and BAS
            numbers deterministically, and attaches the ATO source to every
            claim. You still apply judgement, and material decisions still go
            past a registered tax agent. The difference is you start from the
            law, not from &quot;probably&quot;.
          </p>
        </section>
      </div>

      {/* ----------------------------------------------- CTA */}
      <div className="mt-14 max-w-3xl border-t border-zinc-100 pt-10 text-center">
        <p className="text-[15px] text-zinc-500">
          One line to connect, sign in with your browser.
        </p>
        <a
          href="/app"
          className="btn btn-primary mt-5 inline-block px-7 py-3 text-sm"
        >
          Open App
        </a>
      </div>
    </main>
  );
}
