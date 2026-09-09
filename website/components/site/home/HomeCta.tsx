"use client";

import { useRef } from "react";

/** Magnetic-hover primary CTA. On fine pointers the button eases toward the
 *  cursor via --mx/--my (see .mag-btn); reduced-motion neutralises the
 *  transform in CSS, and touch devices never fire mousemove. */
export function HomeCta() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const my = (e.clientY - (r.top + r.height / 2)) * 0.18;
    el.style.setProperty("--mx", `${mx}px`);
    el.style.setProperty("--my", `${my}px`);
  }
  function onLeave() {
    const el = btnRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  }

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
          Two minutes to a tax-fluent agent
        </h2>
        <p className="mt-4 text-[15px] text-zinc-500">
          Paste one line, sign in with your browser, and get answers you can
          stand behind.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            ref={btnRef}
            href="/app"
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="mag-btn btn btn-primary w-full px-7 py-3.5 text-sm sm:w-auto sm:py-3"
          >
            Open App
          </a>
          <a
            href="https://github.com/william-laverty/ato-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline w-full px-7 py-3.5 text-sm sm:w-auto sm:py-3"
          >
            Read the code
          </a>
        </div>
      </div>
    </section>
  );
}
