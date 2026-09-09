import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { ClosingCta } from "@/components/site/ClosingCta";

export const metadata: Metadata = {
  title: "How do you seat a standard boat?",
  description:
    "Left, right, drummer, sweep: a practical order of operations for filling a standard dragon boat without leaving balance to chance.",
  alternates: { canonical: "/guides/ai-agent-tax-deductions" },
};

/* ---------------------------------------------------------------------------
   /guides/ai-agent-tax-deductions — a reference guide (not a blog story):
   direct answers under question-form headings, extractable lists. Targets
   "how to seat a dragon boat" queries.
--------------------------------------------------------------------------- */

const SEATS = [
  { role: "Sweep", side: "Stern", note: "Steers the boat; fixed at the back" },
  { role: "Drummer", side: "Bow", note: "Sets the pace; fixed at the front" },
  { role: "Stroke pair", side: "Seats 1L / 1R", note: "Sets rhythm and power for the crew" },
  { role: "Middle seats", side: "Seats 2–9", note: "Engine room — balance weight here first" },
  { role: "Back pair", side: "Seats 10L / 10R", note: "Often heavier paddlers; affects trim" },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Do I have to seat left and right alternately?",
    a: "Not strictly, but side balance matters more than perfect alternation. Aim for roughly equal total weight on port and starboard. If someone only paddles one side, pair them with a strong opposite-side paddler nearby.",
  },
  {
    q: "Where do I put heavier paddlers?",
    a: "Heavier paddlers shift the boat's centre of mass. In a standard boat, spread them through the middle seats (3–8) rather than stacking them at bow or stern. Check fore-aft trim after every few swaps.",
  },
  {
    q: "What if someone can only paddle one side?",
    a: "Record their preferred side in your roster and seat them there when you can. When balance needs a fix, swap someone in an adjacent seat rather than moving the whole boat around at the last minute.",
  },
  {
    q: "Can Paddltir do this for me?",
    a: "Paddltir won't pick your crew for you, but it shows side balance and fore-aft trim as you seat people — so you see the effect of each swap before you commit.",
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
      { name: "How do you seat a standard boat?", path: "/guides/ai-agent-tax-deductions" },
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
              How do you seat a standard boat?
            </h1>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              A standard dragon boat carries twenty paddlers — ten left, ten
              right — plus a drummer at the bow and a sweep at the stern. The
              trick is filling it in an order that keeps side balance and
              fore-aft trim in check, not redrawing the whole lineup on the
              pontoon.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What roles are fixed?
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Start with the two roles that don&apos;t move: sweep at the stern
              and drummer at the bow. Everyone else fills the ten seat pairs
              between them, numbered from the bow (seat 1) to the stern (seat
              10).
            </p>
            <div className="card overflow-hidden p-0">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="eyebrow px-4 py-2.5 text-left">Role</th>
                    <th className="eyebrow px-4 py-2.5 text-left">Position</th>
                    <th className="eyebrow px-4 py-2.5 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {SEATS.map((row, idx) => (
                    <tr key={row.role} className={idx % 2 === 1 ? "bg-zinc-50/70" : "bg-white"}>
                      <td className="px-4 py-2 text-[13px] text-zinc-900">{row.role}</td>
                      <td className="px-4 py-2 font-mono text-xs text-zinc-500">{row.side}</td>
                      <td className="px-4 py-2 text-[13px] text-zinc-700">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What order should you fill seats?
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Work from the outside in — fixed roles first, then the pairs that
              matter most for rhythm and balance:
            </p>
            <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-zinc-700">
              <li>
                Lock in sweep and drummer. They anchor fore-aft trim at both
                ends.
              </li>
              <li>
                Seat the stroke pair (1L and 1R). These paddlers set the rate
                the rest of the crew follows.
              </li>
              <li>
                Fill middle seats (roughly 3–8), alternating sides and watching
                total weight on port vs starboard as you go.
              </li>
              <li>
                Place the back pair (10L and 10R). Heavier paddlers here pull
                the stern down — check trim before you call it done.
              </li>
              <li>
                Walk the boat one last time: any empty seats, anyone on the
                wrong side, any side more than a few kilos heavy?
              </li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              What should you check before you push off?
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-zinc-700">
              <li>
                Side balance: total weight on left and right within a few
                kilograms of each other.
              </li>
              <li>
                Fore-aft trim: the boat should sit level, not bow- or
                stern-heavy.
              </li>
              <li>
                Preferred sides: paddlers seated where they paddle strongest,
                unless balance needs an override.
              </li>
              <li>
                Empty seats: every slot filled, or a deliberate reserve noted
                so the sweep knows the count.
              </li>
            </ul>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              In Paddltir, these checks update live as you drag paddlers into
              seats — so a last-minute swap shows its effect before you commit.
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
                Who belongs in which seat?
              </Link>
              ,{" "}
              <Link href="/blog/so-you-bought-a-laptop-in-the-eofy-sales" className={linkCls}>
                So you finally weighed the whole crew
              </Link>{" "}
              and{" "}
              <Link href="/guides/can-ai-do-my-bas" className={linkCls}>
                How do you run multiple heats?
              </Link>
            </p>
          </section>
        </div>
      </main>
      <ClosingCta />
    </>
  );
}
