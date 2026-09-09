import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClosingCta } from "../components/site/ClosingCta";
import { TeamsMarquee } from "../components/site/TeamsMarquee";
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

const HOW_IT_WORKS = [
  {
    num: "1",
    title: "Build your roster",
    body: "Add every paddler with weight, erg, preferred side, and role — one source of truth for race week.",
    image: "/how-it-works/01-roster-v2.png",
    imageAlt: "Paddltir roster table with paddler weights, power ratios, and sides",
  },
  {
    num: "2",
    title: "Lock a crewlist",
    body: "Pull athletes into a heat-ready crewlist by age division, boat size, and category.",
    image: "/how-it-works/02-crewlist-v2.png",
    imageAlt: "Paddltir crewlist with members selected for Nationals Open A",
  },
  {
    num: "3",
    title: "Seat the boat",
    body: "Drag paddlers into seats or run Autoconfig — drummer, twenty seats, and sweep in one layout.",
    image: "/how-it-works/03-boat-v2.png",
    imageAlt: "Paddltir crew layout boat with seated paddlers",
  },
  {
    num: "4",
    title: "Check trim & balance",
    body: "See left/right weight, power, preferred-side fit, and bow/stern trim before you push off.",
    image: "/how-it-works/04-insights-v2.png",
    imageAlt: "Paddltir crew controls showing weight balance, power, and trim",
  },
] as const;

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

      {/* ------------------------------------------------ how it works */}
      <section
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-10"
        aria-labelledby="session-h"
      >
        <h2
          id="session-h"
          className="mx-auto max-w-[22ch] text-center text-[clamp(2.35rem,4.6vw,3.4rem)] font-normal leading-[1.45] tracking-tight1 sm:max-w-[28ch]"
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
        <p className="mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-zinc-500 sm:text-[17px]">
          Configure a perfect crew in minutes.
        </p>

        <ol className="mt-16 grid gap-12 sm:mt-20 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-4 lg:gap-7">
          {HOW_IT_WORKS.map((step) => (
            <li key={step.num} className="reveal-scroll flex flex-col">
              <div className="tile relative aspect-square overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-5 text-[1.15rem] font-medium tracking-tight1 text-zinc-900 sm:text-[1.25rem]">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-zinc-500 sm:text-base">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------ teams */}
      <TeamsMarquee />

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
