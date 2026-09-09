import Link from "next/link";
import { AccentThread } from "./AccentThread";

const STRATA = [
  { title: "Guidance", source: "ato.gov.au", stat: "23,200+", unit: "pages" },
  { title: "Legislation", source: "ITAA 1997 & 1936, GST Act", stat: "6,468", unit: "sections · 2,310 definitions" },
  { title: "Rulings", source: "law.ato.gov.au", stat: "4,937", unit: "rulings" },
  { title: "Cross-references", source: "rulings tied to the law behind them", stat: "64,217", unit: "links" },
];

export function HomeCorpus() {
  return (
    <section className="px-3 py-12 sm:py-16" aria-labelledby="corpus-h">
      <div className="hero-card relative px-[clamp(24px,6vw,88px)] py-14 sm:py-20">
        <AccentThread className="left-[clamp(24px,6vw,88px)] hidden h-full sm:block" />
        <div className="mx-auto max-w-6xl">
          <h2
            id="corpus-h"
            className="max-w-xl text-[clamp(1.6rem,3vw,2.25rem)] font-normal leading-[1.1] tracking-tight1"
          >
            Every ATO guide, law and ruling in one searchable place
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-zinc-500">
            Four layers of source, so every answer your agent gives can point to
            the exact place behind it.
          </p>

          {/* Layered strata — each source sits as a physical layer, revealing
              on scroll, with its own number attached exactly once. */}
          <ol className="mt-10 space-y-3">
            {STRATA.map((s, i) => (
              <li
                key={s.title}
                className="card reveal-scroll flex items-baseline justify-between gap-4 p-5"
                style={{ marginLeft: `${i * 16}px` }}
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900">{s.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-400">{s.source}</p>
                </div>
                <p className="shrink-0 text-right">
                  <span className="text-[1.5rem] tracking-tight1 text-zinc-900">
                    {s.stat}
                  </span>{" "}
                  <span className="text-xs text-zinc-400">{s.unit}</span>
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-sm text-zinc-500">
            34,564 documents · 286,638 searchable passages, rebuilt monthly and
            served fresh.{" "}
            <Link
              href="/docs"
              className="text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900"
            >
              See what&apos;s inside
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
