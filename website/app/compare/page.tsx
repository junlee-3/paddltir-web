import type { Metadata } from "next";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { ClosingCta } from "@/components/site/ClosingCta";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "Three ways to build a race-day lineup: paper roster, spreadsheet, or Paddltir. An honest comparison for dragon boat crew managers.",
  alternates: { canonical: "/compare" },
};

const pageJsonLd = {
  "@context": "https://schema.org",
  ...breadcrumbJsonLd([{ name: "Compare", path: "/compare" }]),
};

const ROWS: { label: string; ato: string; alone: string; mcp: string }[] = [
  {
    label: "Where the data lives",
    ato: "Names scribbled on a clipboard, weights in someone's head",
    alone: "One shared sheet, often with conflicting edits",
    mcp: "One roster your whole coaching team reads from",
  },
  {
    label: "Seating a heat",
    ato: "Draw boxes on paper and hope you counted seats",
    alone: "Copy-paste rows, manually check left/right balance",
    mcp: "Seat the boat, swap paddlers, copy heats in a few clicks",
  },
  {
    label: "Trim and balance",
    ato: "Eyeball it, or run numbers on a calculator afterwards",
    alone: "Formulas if someone built them; fragile when weights change",
    mcp: "Fore-aft trim and side balance update as you seat people",
  },
  {
    label: "Race-day changes",
    ato: "Cross out names, redraw, pray the sweep can read your handwriting",
    alone: "Find the right tab, undo the wrong paste, notify everyone again",
    mcp: "Swap seats, copy to the next heat, empty-seat check before you launch",
  },
  {
    label: "Multiple heats",
    ato: "Separate sheets per heat, easy to mix up",
    alone: "Tabs multiply; version control becomes someone's job",
    mcp: "Crewlists for the weekend, heats linked, compare lineups side by side",
  },
  {
    label: "Time on race morning",
    ato: "Works for one boat; falls apart with three heats and a late swap",
    alone: "Faster than paper until someone edits the wrong column",
    mcp: "Minutes to seat, check gaps, and confirm balance",
  },
];

export default function ComparePage() {
  return (
    <>
    <main className="mx-auto min-h-screen max-w-5xl px-5 pb-24 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <h1 className="max-w-2xl text-[clamp(2rem,4vw,2.75rem)] font-normal leading-[1.08] tracking-tight2 text-zinc-900">
        Three ways to seat a boat
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-500">
        Nationals weekend. Three heats, two late swaps, and someone just asked
        whether the mixed 200 is balanced. You can work from a paper roster,
        wrangle a spreadsheet, or use Paddltir. Here is the honest difference.
      </p>

      {/* ----------------------------------------------- comparison table */}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" className="w-[18%] py-3 pr-4 font-medium text-zinc-500"></th>
              <th scope="col" className="w-[27%] py-3 pr-4 font-medium text-zinc-900">
                Paper roster
              </th>
              <th scope="col" className="w-[27%] py-3 pr-4 font-medium text-zinc-900">
                Spreadsheet
              </th>
              <th scope="col" className="w-[28%] py-3 font-medium text-zinc-900">
                Paddltir
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
            Paper roster
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            Simple, visible, and hard to argue with on the bank. For one boat
            and one heat it works fine. The problem is scale: multiple heats,
            last-minute swaps, and balance checks mean redrawing or maintaining
            parallel sheets. By Sunday afternoon the authoritative version is
            whichever clipboard the coach is holding.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            Spreadsheet
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            Better for sorting names and storing weights. But seating left and
            right, copying heats, and checking trim usually means custom
            formulas someone built once and nobody wants to touch. One wrong
            paste on race morning and half the club is looking at the wrong
            lineup.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            Paddltir
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            Built for the actual workflow: roster your paddlers, crewlist the
            weekend, seat each heat, swap seats without starting over, and read
            trim and side balance before you confirm. Empty-seat checks catch
            missing drummer or sweep before you leave the dock. You still make
            the selection calls — Paddltir just stops the admin from eating
            race morning.
          </p>
        </section>
      </div>

    </main>
    <ClosingCta />
    </>
  );
}
