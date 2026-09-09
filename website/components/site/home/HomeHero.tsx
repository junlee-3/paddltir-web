import Link from "next/link";
import { Fragment } from "react";
import { AnnouncementBanner } from "../AnnouncementBanner";

const HERO_TRUST = [
  { title: "Every answer cited", sub: "the section, the ruling, the page" },
  { title: "Works with your agent", sub: "Claude, ChatGPT and more" },
  { title: "Rebuilt monthly", sub: "served fresh" },
];

const THREAD_CHIPS = ["ITAA 1997 · s 8-1", "PCG 2023/1", "TR 93/30"];

/** The citation-thread origin: a question, a vermillion line dropping through
 *  real citations, and a "watch it work" cue pointing into the demo below.
 *  Desktop-only visual anchor (replaces the old static answer card). */
function ThreadOrigin() {
  return (
    <div className="relative hidden pl-8 lg:block">
      <span className="accent-thread left-[3px] h-full" aria-hidden="true">
        <span className="accent-node" style={{ top: "6px", left: "0" }} />
      </span>
      <p className="font-mono text-[0.8125rem] text-zinc-400">
        › can I claim my home office?
      </p>
      <div className="mt-6 space-y-3">
        {THREAD_CHIPS.map((c) => (
          <div key={c} className="flex items-center gap-3">
            <span className="h-px w-6 bg-brand-200" aria-hidden="true" />
            <span className="chip">
              <span className="chip-dot" />
              {c}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-8 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-zinc-400">
        ↓ watch it work
      </p>
    </div>
  );
}

function HeroTrust({ className = "" }: { className?: string }) {
  return (
    <dl className={`flex flex-wrap items-center gap-x-6 gap-y-4 ${className}`}>
      {HERO_TRUST.map((t, i) => (
        <Fragment key={t.title}>
          {i > 0 && (
            <span className="hidden h-9 w-px shrink-0 bg-zinc-200 sm:block" aria-hidden="true" />
          )}
          <div>
            <dt className="text-sm text-zinc-900">{t.title}</dt>
            <dd className="text-sm text-zinc-400">{t.sub}</dd>
          </div>
        </Fragment>
      ))}
    </dl>
  );
}

export function HomeHero() {
  return (
    <section className="relative -mt-16">
      <AnnouncementBanner />
      <div className="px-3 pb-3 pt-3 lg:pt-0">
        <div className="hero-card flex min-h-[calc(100svh-24px)] flex-col lg:min-h-[calc(100svh-64px)] lg:flex-row lg:items-center">
          <span className="hero-glow" aria-hidden="true" />
          <div className="relative flex w-full flex-1 flex-col px-[clamp(24px,7vw,88px)] py-16 sm:py-20 lg:grid lg:flex-none lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-24">
            <div className="flex flex-1 flex-col items-center justify-center text-center lg:block lg:flex-none lg:text-left">
              <h1
                className="reveal-lcp max-w-[16ch] text-[clamp(2.25rem,8.5vw,3.5rem)] font-normal leading-[1.08] tracking-tight2 text-zinc-900 sm:max-w-none sm:leading-[1.04]"
                style={{ "--reveal-delay": "0s" } as React.CSSProperties}
              >
                Your AI agent, fluent in Australian tax
              </h1>
              <p
                className="reveal mx-auto mt-5 max-w-sm text-[15px] leading-relaxed text-zinc-500 sm:max-w-xl lg:mx-0"
                style={{ "--reveal-delay": "0.16s" } as React.CSSProperties}
              >
                Connect your agent and get cited answers to the tax questions
                you&apos;d otherwise wait on your accountant for — the source
                attached to every one.
              </p>
              <div
                className="reveal mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center lg:justify-start"
                style={{ "--reveal-delay": "0.24s" } as React.CSSProperties}
              >
                <a href="/app" className="btn btn-primary w-full max-w-xs px-7 py-3.5 text-sm sm:w-auto sm:py-3">
                  Open App
                </a>
                <Link href="/docs" className="btn btn-outline hidden w-full max-w-xs px-7 py-3.5 text-sm sm:inline-flex sm:w-auto sm:py-3">
                  Read the docs
                </Link>
              </div>
            </div>

            <ThreadOrigin />

            <dl className="reveal mt-10 grid w-full grid-cols-3 gap-x-3 border-t border-zinc-100 pt-6 text-center lg:hidden">
              {HERO_TRUST.map((t) => (
                <div key={t.title}>
                  <dt className="text-[13px] font-medium leading-tight text-zinc-900">{t.title}</dt>
                  <dd className="mt-1 text-[11px] leading-snug text-zinc-400">{t.sub}</dd>
                </div>
              ))}
            </dl>
          </div>

          <HeroTrust className="absolute bottom-[clamp(28px,5vh,56px)] left-[clamp(28px,6vw,88px)] hidden lg:flex" />
        </div>
      </div>
    </section>
  );
}
