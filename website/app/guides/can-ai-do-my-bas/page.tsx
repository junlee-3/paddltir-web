import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { ClosingCta } from "@/components/site/ClosingCta";

export const metadata: Metadata = {
  title: "How do you run multiple heats?",
  description:
    "Open, mixed, women's — keep separate lineups for each heat so one change doesn't wipe the next race.",
  alternates: { canonical: "/guides/can-ai-do-my-bas" },
};

/* ---------------------------------------------------------------------------
   /guides/can-ai-do-my-bas — a reference guide (not a blog story): direct
   answers under question-form headings, a heat-by-heat workflow table.
   Targets "dragon boat multiple heats race day" queries.
--------------------------------------------------------------------------- */

const HEATS = [
  { heat: "Heat 1", category: "Open 500m", time: "08:30", note: "Full-strength lineup — seat first" },
  { heat: "Heat 2", category: "Mixed 500m", time: "10:15", note: "Gender mix rules apply — separate crewlist" },
  { heat: "Heat 3", category: "Women's 500m", time: "12:00", note: "Copy from open, swap paddlers as needed" },
  { heat: "Heat 4", category: "Open 2000m", time: "14:30", note: "Endurance crew — check reserves and fatigue" },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Should each heat have its own crewlist?",
    a: "Yes. A crewlist is the set of paddlers available for one race. Keep open, mixed, and women's heats separate so editing one lineup never overwrites another.",
  },
  {
    q: "Can I copy a lineup between heats?",
    a: "Copy the starting point, then adjust. Most clubs copy the open heat into mixed or women's and swap individual seats — not rebuild from scratch each time.",
  },
  {
    q: "What about paddlers who can't make every heat?",
    a: "Mark them as unavailable for the heats they miss before you seat the boat. That way you don't discover a gap five minutes before launch.",
  },
  {
    q: "How does Paddltir handle this?",
    a: "Create a crewlist per heat, seat each boat independently, and copy lineups between heats when the roster overlap is high. Changes stay scoped to the heat you're working on.",
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
    breadcrumbJsonLd([
      { name: "How do you run multiple heats?", path: "/guides/can-ai-do-my-bas" },
    ]),
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
              How do you run multiple heats?
            </h1>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              A regatta day is rarely one race. Open, mixed, women&apos;s,
              sprints and distance — each heat needs its own lineup, and a
              scratch in heat two shouldn&apos;t scramble heat four. The goal is
              separate crewlists per heat, with copy-and-adjust between them
              instead of starting from zero every time.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What does a typical regatta day look like?
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Most clubs run two to four heats in a day. Each one has its own
              category rules, start time, and crew mix:
            </p>
            <div className="card overflow-hidden p-0">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="eyebrow px-4 py-2.5 text-left">Heat</th>
                    <th className="eyebrow px-4 py-2.5 text-left">Category</th>
                    <th className="eyebrow px-4 py-2.5 text-left">Start</th>
                    <th className="eyebrow px-4 py-2.5 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {HEATS.map((row, idx) => (
                    <tr key={row.heat} className={idx % 2 === 1 ? "bg-zinc-50/70" : "bg-white"}>
                      <td className="px-4 py-2 text-[13px] text-zinc-900">{row.heat}</td>
                      <td className="px-4 py-2 text-[13px] text-zinc-700">{row.category}</td>
                      <td className="px-4 py-2 font-mono text-xs text-zinc-500">{row.time}</td>
                      <td className="px-4 py-2 text-[13px] text-zinc-500">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Times are illustrative — your regatta program is the source of
              truth. Seat the earliest heat first, then work forward through the
              day.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              How do you keep heats from overwriting each other?
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              The roster is your pool of paddlers. Each heat gets its own
              crewlist — the subset available for that race. Never seat all heats
              from one shared lineup:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-zinc-700">
              <li>
                Create a crewlist per heat before race day, or at least before
                the first call to the pontoon.
              </li>
              <li>
                Mark unavailable paddlers on the crewlist for heats they
                can&apos;t make — not on the master roster alone.
              </li>
              <li>
                Copy a seated boat from one heat to the next, then swap
                individual seats for category rules or fatigue.
              </li>
              <li>
                Re-check trim and side balance after every copy — a mixed crew
                often needs different weight distribution than open.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What changes between open, mixed, and women&apos;s?
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Category rules vary by regatta, but the seating workflow is the
              same:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-zinc-700">
              <li>
                <strong className="font-medium text-zinc-900">Open:</strong>{" "}
                your strongest available crew — seat this one first as the
                baseline.
              </li>
              <li>
                <strong className="font-medium text-zinc-900">Mixed:</strong>{" "}
                gender mix requirements apply. Copy from open, swap paddlers to
                meet the ratio, re-check balance.
              </li>
              <li>
                <strong className="font-medium text-zinc-900">Women&apos;s:</strong>{" "}
                often overlaps heavily with open. Copy and remove male paddlers,
                fill gaps from reserves.
              </li>
            </ul>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Distance heats (1000m, 2000m) may need a different crew mix than
              sprints — lighter bow pairs, more endurance paddlers in the
              middle. Treat them as separate crewlists even if the category name
              matches an earlier sprint.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What does Paddltir do on race day?
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Paddltir keeps rosters, crewlists, and seated boats in one place.
              Create a crewlist per heat, seat each boat independently, copy
              lineups between heats, and check trim before every launch. A swap
              in heat two stays in heat two — it won&apos;t touch heat four.
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
                It&apos;s race weekend again
              </Link>{" "}
              and{" "}
              <Link href="/guides/ai-agent-tax-deductions" className={linkCls}>
                How do you seat a standard boat?
              </Link>
            </p>
          </section>
        </div>
      </main>
      <ClosingCta />
    </>
  );
}
