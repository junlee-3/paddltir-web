import { GitHubIcon } from "./GitHubIcon";

/* ---------------------------------------------------------------------------
   The site-wide closing CTA (homepage pattern): full-bleed glow section that
   melts into the footer card below. Rendered as the last element before the
   footer on the homepage, /docs, /faq, /compare and guides.
--------------------------------------------------------------------------- */

export function ClosingCta() {
  return (
    <section className="glow-cta px-5 pt-20 pb-28 sm:pt-24">
      <div className="mx-auto max-w-2xl text-center">
        <svg
          width={48}
          height={48}
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
          className="mx-auto"
        >
          <rect x="1" y="1" width="30" height="30" rx="8.5" fill="#fa520f" />
          <circle cx="10.5" cy="16" r="2.6" fill="#ffffff" />
          <rect x="15" y="13.9" width="7.5" height="4.2" rx="2.1" fill="#ffffff" />
        </svg>
        <h2 className="mt-7 text-[clamp(1.65rem,6vw,2.5rem)] font-normal leading-[1.1] tracking-tight2 text-zinc-900">
          Seat your crews before you leave the bank
        </h2>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href="/app"
            className="btn btn-primary w-full px-7 py-3.5 text-sm sm:w-auto sm:py-3"
          >
            Open App
          </a>
          <a
            href="https://github.com/junlee-3/paddltir-web"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline w-full px-7 py-3.5 text-sm sm:w-auto sm:py-3"
          >
            <GitHubIcon size={15} />
            Star on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
