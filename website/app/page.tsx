import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { ClosingCta } from "../components/site/ClosingCta";
import { HOME_FAQS } from "../lib/faqs";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/* ---------------------------------------------------------------------------
   Landing page — Clinical system. Fully light: white sections alternating
   with zinc-50 bands, hairline borders, one vermillion accent reserved for
   citation chips and small markers. Hero is a looping dragon-boat video.
--------------------------------------------------------------------------- */

const HERO_TRUST = [
  { title: "Configure", sub: "seat every paddler with weight and side in mind" },
  { title: "Manage", sub: "keep rosters and crewlists ready for race day" },
  { title: "Insights", sub: "see trim, balance, and lineup gaps before you race" },
];

const CORPUS_STATS = [
  { n: "120+", label: "roster slots", sub: "every paddler with side, weight, and availability" },
  { n: "24", label: "heats per regatta", sub: "crewlists built and adjusted heat by heat" },
  { n: "6", label: "live insight checks", sub: "balance, trim, and lineup gaps before you race" },
];

const CORPUS_INDEX = [
  { num: "01", title: "Rosters", sub: "paddlers, sides, and weights in one place" },
  { num: "02", title: "Crewlists", sub: "heat-by-heat lineups for race day" },
  { num: "03", title: "Trim & balance", sub: "side weight and bow/stern checks" },
  { num: "04", title: "Insights", sub: "gaps and risks surfaced before you push off" },
];

const SESSION_TURNS = [
  {
    graphic: "deductions" as const,
    question: "How do I seat a balanced boat?",
    answer:
      "It weighs side balance and stroke position against your roster so no bench feels heavy. Each swap shows the knock-on effect before you commit.",
    tool: "Balance planner",
  },
  {
    graphic: "depreciation" as const,
    question: "Who's in the boat for this heat?",
    answer:
      "Pull from your roster, lock in reservations, and export a crewlist your marshall can read at a glance. Changes stay in sync so nobody shows up to the wrong lane.",
    tool: "Crewlist builder",
  },
  {
    graphic: "risk" as const,
    question: "Are we trimmed for this heat?",
    answer:
      "It flags bow-heavy setups, uneven sides, and gaps against your target before you push off. You see where you sit — comfortably balanced or worth a last-minute swap.",
    tool: "Trim check",
  },
];

const FAQS = HOME_FAQS;

const SITE = "https://paddltir-web.vercel.app";

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE}/#app`,
      name: "Paddltir",
      alternateName: "Paddltir crew management",
      operatingSystem: "Web",
      applicationCategory: "SportsApplication",
      description:
        "Dragon boat crew management software. Configure rosters, build race-day crewlists, and get trim and balance insights before every heat.",
      url: SITE,
      mainEntityOfPage: SITE,
      offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
      author: { "@id": `${SITE}/#org` },
      publisher: { "@id": `${SITE}/#org` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "Paddltir",
      url: SITE,
    },
    {
      "@type": "SoftwareSourceCode",
      name: "paddltir-web",
      description:
        "Dragon boat crew management web app for rosters, crewlists, and race-day insights. Source is public; copyright retained.",
      codeRepository: "https://github.com/junlee-3/paddltir-web",
      programmingLanguage: "TypeScript",
      license: "https://github.com/junlee-3/paddltir-web/blob/main/LICENSE",
      author: { "@id": `${SITE}/#org` },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

/* ---------------------------------------------------------------------------
   Session graphics — small, decorative SVGs in the Clinical style: hairline
   zinc strokes, soft zinc fills, the vermillion accent used once each. They
   visualise what the tool does, so the copy can stay short.
--------------------------------------------------------------------------- */

const GRAPHIC_CLASS = "h-auto w-full max-w-[360px]";

/** deduction_discovery — a taxonomy grid with a few categories "matched". */
function DeductionsGraphic() {
  const cols = 5;
  const rows = 3;
  const tw = 56;
  const th = 40;
  const gx = 16;
  const gy = 16;
  const ox = 10;
  const oy = 10;
  const filled = new Set([0, 1, 3, 4, 6, 8, 9, 11, 12]);
  const matched = new Set([1, 4, 6, 9, 12]);
  const width = ox * 2 + cols * tw + (cols - 1) * gx;
  const height = oy * 2 + rows * th + (rows - 1) * gy;
  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const x = ox + c * (tw + gx);
      const y = oy + r * (th + gy);
      const isFilled = filled.has(idx);
      tiles.push(
        <g key={idx}>
          <rect
            x={x}
            y={y}
            width={tw}
            height={th}
            rx="8"
            fill={isFilled ? "#f4f4f5" : "none"}
            stroke={isFilled ? "#d4d4d8" : "#e4e4e7"}
            strokeWidth="1"
          />
          {matched.has(idx) && (
            <circle cx={x + tw - 11} cy={y + 11} r="3" fill="#fa520f" />
          )}
        </g>,
      );
    }
  }
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={GRAPHIC_CLASS}
      fill="none"
      aria-hidden="true"
    >
      {tiles}
    </svg>
  );
}

/** depreciation_helper — a diminishing-value step-down with a curve over it. */
function DepreciationGraphic() {
  const values = [100, 70, 49, 34, 24, 17];
  const bw = 40;
  const gap = 18;
  const ox = 16;
  const baseY = 150;
  const maxH = 120;
  const width = ox * 2 + values.length * bw + (values.length - 1) * gap;
  const bars = values.map((v, i) => {
    const h = (v / 100) * maxH;
    const x = ox + i * (bw + gap);
    const y = baseY - h;
    return (
      <g key={i}>
        <rect
          x={x}
          y={y}
          width={bw}
          height={h}
          rx="4"
          fill="#f4f4f5"
          stroke="#d4d4d8"
          strokeWidth="1"
        />
        {i === 0 && <rect x={x} y={y} width={bw} height="3" rx="1.5" fill="#fa520f" />}
      </g>
    );
  });
  const curve = values
    .map((v, i) => {
      const h = (v / 100) * maxH;
      const x = ox + i * (bw + gap) + bw / 2;
      const y = baseY - h;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${width} 170`}
      className={GRAPHIC_CLASS}
      fill="none"
      aria-hidden="true"
    >
      {bars}
      <path d={curve} stroke="#d4d4d8" strokeWidth="1.5" strokeDasharray="3 4" />
      <line
        x1={ox - 4}
        y1={baseY + 0.5}
        x2={width - ox + 4}
        y2={baseY + 0.5}
        stroke="#e4e4e7"
        strokeWidth="1"
      />
    </svg>
  );
}

/** audit_risk_check — a LOW/MED/HIGH gauge with the marker resting on LOW. */
function RiskGraphic() {
  const x0 = 18;
  const w = 324;
  const y = 70;
  const h = 14;
  const seg = w / 3;
  const markerX = x0 + seg / 2;
  return (
    <svg
      viewBox="0 0 360 130"
      className={GRAPHIC_CLASS}
      fill="none"
      aria-hidden="true"
    >
      {/* track */}
      <rect x={x0} y={y} width={w} height={h} rx={h / 2} fill="#f4f4f5" />
      {/* low band tinted */}
      <path
        d={`M ${x0 + h / 2} ${y} H ${x0 + seg} V ${y + h} H ${x0 + h / 2} A ${h / 2} ${h / 2} 0 0 1 ${x0 + h / 2} ${y} Z`}
        fill="#fde8df"
      />
      {/* segment dividers */}
      <line x1={x0 + seg} y1={y - 6} x2={x0 + seg} y2={y + h + 6} stroke="#e4e4e7" strokeWidth="1" />
      <line x1={x0 + 2 * seg} y1={y - 6} x2={x0 + 2 * seg} y2={y + h + 6} stroke="#e4e4e7" strokeWidth="1" />
      {/* marker on LOW */}
      <line x1={markerX} y1={y - 14} x2={markerX} y2={y + h} stroke="#fa520f" strokeWidth="1.5" />
      <circle cx={markerX} cy={y - 16} r="5" fill="#fa520f" />
      {/* labels */}
      <text x={markerX} y={y + h + 24} textAnchor="middle" className="font-mono" fontSize="11" fill="#fa520f">LOW</text>
      <text x={x0 + 1.5 * seg} y={y + h + 24} textAnchor="middle" className="font-mono" fontSize="11" fill="#a1a1aa">MED</text>
      <text x={x0 + 2.5 * seg} y={y + h + 24} textAnchor="middle" className="font-mono" fontSize="11" fill="#a1a1aa">HIGH</text>
    </svg>
  );
}

function SessionGraphic({ kind }: { kind: "deductions" | "depreciation" | "risk" }) {
  if (kind === "deductions") return <DeductionsGraphic />;
  if (kind === "depreciation") return <DepreciationGraphic />;
  return <RiskGraphic />;
}

/** Trust strip over the dark video: white title/subtitle pairs + soft hairlines. */
function HeroTrust({ className = "" }: { className?: string }) {
  return (
    <dl className={`flex flex-wrap items-center gap-x-6 gap-y-4 ${className}`}>
      {HERO_TRUST.map((t, i) => (
        <Fragment key={t.title}>
          {i > 0 && (
            <span
              className="hidden h-9 w-px shrink-0 bg-white/25 sm:block"
              aria-hidden="true"
            />
          )}
          <div>
            <dt className="text-sm text-white">{t.title}</dt>
            <dd className="text-sm text-white/60">{t.sub}</dd>
          </div>
        </Fragment>
      ))}
    </dl>
  );
}

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* ------------------------------------------------ hero */}
      {/* -mt-16 cancels the layout's global `pt-16` (which clears the fixed nav
          for every other page) so the hero card goes full-bleed to the top and
          the nav floats *over* the card — content is centred well clear of it. */}
      <section className="relative -mt-16">
        {/* heynox card inset: 12px on all sides. */}
        <div className="relative p-3">
          <div className="hero-card flex min-h-[calc(100svh-24px)] flex-col bg-zinc-950 lg:flex-row lg:items-center">
            {/* Full-bleed looping video — fade is baked into the footage. */}
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            >
              <source src="/hero-video.mov" type="video/quicktime" />
            </video>
            <div className="relative z-10 flex w-full flex-1 flex-col px-[clamp(24px,7vw,88px)] py-16 sm:py-20 lg:grid lg:flex-none lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-24">
              {/* Main hero block — centred stack on mobile (heynox-style),
                  left-aligned on desktop. */}
              <div className="flex flex-1 flex-col items-center justify-center pt-[34px] text-center lg:block lg:flex-none lg:text-left">
                <h1
                  className="reveal-lcp max-w-[16ch] text-[clamp(2.25rem,8.5vw,3.5rem)] font-normal leading-[1.08] tracking-tight2 text-white sm:max-w-none sm:leading-[1.04]"
                  style={{ "--reveal-delay": "0s" } as React.CSSProperties}
                >
                  Build crews that
                  <br />
                  <em className="pr-[0.04em] [font-family:var(--font-serif-accent)] text-[1.06em] leading-none [-webkit-text-stroke:0.35px_#ffffff]">win</em> when it counts
                </h1>
                <p
                  className="reveal mx-auto mt-2.5 max-w-sm text-[15px] leading-relaxed text-white/70 sm:max-w-xl lg:mx-0"
                  style={{ "--reveal-delay": "0.16s" } as React.CSSProperties}
                >
                  Configure, manage, and get real insights into your crew.
                </p>
                <div
                  className="reveal mt-[18px] flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center lg:justify-start"
                  style={{ "--reveal-delay": "0.24s" } as React.CSSProperties}
                >
                  <a
                    href="/app"
                    className="btn w-full max-w-xs bg-white px-7 py-3.5 text-sm text-zinc-900 hover:bg-white/90 sm:w-auto sm:py-3"
                  >
                    Open App
                  </a>
                </div>
              </div>

              {/* Right column empty on desktop — video carries that side.
                  Trust strip is desktop-only (pinned bottom-left below);
                  mobile keeps just headline + CTA. */}
              <div className="relative hidden lg:block" />
            </div>

            {/* Desktop trust strip — pinned to the card's bottom-left */}
            <HeroTrust className="absolute bottom-[clamp(48px,calc(5vh+20px),76px)] left-[clamp(28px,6vw,88px)] z-10 hidden lg:flex" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ the session */}
      <section
        className="mx-auto max-w-6xl px-5 py-20 sm:py-24"
        aria-labelledby="session-h"
      >
        <h2
          id="session-h"
          className="mx-auto max-w-[20ch] text-center text-[clamp(2.15rem,4.2vw,3.15rem)] font-normal leading-[1.5] tracking-tight1 sm:max-w-[26ch]"
        >
          Your athletes give you{" "}
          <em className="[font-family:var(--font-serif-accent)] text-[1.06em] leading-none [-webkit-text-stroke:0.35px_currentColor]">
            their best
          </em>
          .
          <br className="hidden sm:block" /> Do{" "}
          <em className="[font-family:var(--font-serif-accent)] text-[1.06em] leading-none [-webkit-text-stroke:0.35px_currentColor]">
            your best
          </em>{" "}
          for them.
        </h2>

        {/* Alternating wide rows: plain-language turn on one side, a graphic
            of what the tool did on the other. Sides swap each turn. */}
        <div className="mt-14 space-y-12 sm:mt-16 sm:space-y-20">
          {SESSION_TURNS.map((turn, i) => (
            <div
              key={turn.question}
              className="reveal-scroll grid items-center gap-6 sm:gap-14 lg:grid-cols-2"
            >
              {/* Graphic always follows the question on mobile (order-2); on
                  desktop the sides alternate each turn. */}
              <div className={`order-2 ${i % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                <div className="tile flex min-h-[180px] items-center justify-center p-6 sm:min-h-[280px] sm:p-12">
                  <SessionGraphic kind={turn.graphic} />
                </div>
              </div>
              <div className={`order-1 ${i % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                <h3 className="max-w-md text-[clamp(1.25rem,2.2vw,1.6rem)] font-normal leading-[1.15] tracking-tight1 text-zinc-900">
                  {turn.question}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-600 sm:text-base">
                  {turn.answer}
                </p>
                <p className="mt-5 font-mono text-[0.6875rem] text-zinc-500">
                  <Link
                    href="/docs#toolsref-h"
                    className="transition-colors duration-200 hover:text-zinc-600"
                  >
                    {turn.tool} →
                  </Link>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ corpus */}
      {/* Contained in its own rounded card, matching the hero card chrome
          (24px radius, hairline border, warm paper, layered shadow) and its
          12px edge inset (px-3); content stays centred at max-w-6xl inside. */}
      <section className="px-3 py-12 sm:py-16" aria-labelledby="corpus-h">
        <div className="hero-card px-[clamp(24px,6vw,88px)] py-14 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_260px] lg:gap-12">
            <div>
              <h2
                id="corpus-h"
                className="max-w-xl text-[clamp(1.6rem,3vw,2.25rem)] font-normal leading-[1.1] tracking-tight1"
              >
                Everything your crew needs, in one place
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-zinc-500">
                So every lineup you publish is balanced, traceable, and ready
                before the horn.
              </p>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {CORPUS_STATS.map((s) => (
                  <div key={s.label} className="card reveal-scroll p-5">
                    <p className="text-[1.75rem] tracking-tight1 text-zinc-900">
                      {s.n}
                    </p>
                    <p className="mt-1 text-sm font-medium">{s.label}</p>
                    <p className="mt-1 text-xs text-zinc-500">{s.sub}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-zinc-500">
                Updated as your roster changes.{" "}
                <Link
                  href="/docs"
                  className="text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900"
                >
                  See what&apos;s inside
                </Link>
              </p>
            </div>
            <div className="border-t border-zinc-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <ol>
                {CORPUS_INDEX.map((i, idx) => (
                  <li
                    key={i.num}
                    className={`flex items-baseline justify-between gap-4 py-4 ${
                      idx < CORPUS_INDEX.length - 1 ? "border-b border-zinc-200" : ""
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{i.title}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">{i.sub}</p>
                    </div>
                    <span className="font-mono text-[0.6875rem] text-zinc-500">
                      {i.num}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ FAQ */}
      <section className="mx-auto max-w-3xl px-5 pb-20 sm:pb-24" aria-labelledby="faq-h">
        <h2
          id="faq-h"
          className="text-center text-[clamp(1.6rem,3vw,2.25rem)] font-normal tracking-tight1"
        >
          Before you start
        </h2>
        <div className="mt-10">
          {FAQS.map((f) => (
            <details key={f.q} className="group border-b border-zinc-100 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium marker:hidden">
                {f.q}
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
        <p className="mt-8 text-center text-sm text-zinc-500">
          More questions?{" "}
          <Link
            href="/faq"
            className="text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900"
          >
            Read the full FAQ
          </Link>
        </p>
      </section>

      {/* ------------------------------------------------ final CTA
          On plain white with a faint glow + deep bottom padding so it melts
          into the page; the floating footer card below then reads as an inset
          panel overlaying the extended bottom of the CTA (pluck pattern). */}
      <ClosingCta />
    </main>
  );
}
