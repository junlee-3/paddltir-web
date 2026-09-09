"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
const LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/blogs", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

const SCROLL_THRESHOLD = 50;

// Initial fixed-header offset while the home announcement bar is visible
// (heynox value). Deliberately less than the bar's 52px: with the header's
// 20px unscrolled padding the pill rests just 8px inside the hero card's top
// edge, and rides up 1:1 with the page (top = max(0, 40 − scrollY)) until it
// pins — where the padding morph takes over as the scrolled state.
const NAV_INITIAL_TOP = 40;

function Mark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="30" height="30" rx="8.5" fill="#fa520f" />
      <circle cx="10.5" cy="16" r="2.6" fill="#ffffff" />
      <rect x="15" y="13.9" width="7.5" height="4.2" rx="2.1" fill="#ffffff" />
    </svg>
  );
}

/**
 * Scroll-aware nav: at the top of the page it reads as a full-width
 * transparent bar — logo left, links centre, CTA right. Scrolling collapses
 * it into a centred floating glass pill (white/80 + blur + hairline + soft
 * shadow). On mobile the pill is always painted and expands downward to
 * reveal the menu.
 */
export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const scrolledRef = useRef(false);
  const headerRef = useRef<HTMLElement | null>(null);

  const isHome = pathname === "/";

  // One scroll owner for the header (heynox pattern): the pill morph and the
  // announcement-bar offset are computed in the same rAF batch. While the
  // home-page announcement bar is visible the fixed header starts below it
  // and slides up with the page (top = max(0, bar − scrollY)) until it pins
  // to the viewport top; pages (and breakpoints) without the bar sit at 0.
  useEffect(() => {
    let raf = 0;
    let announcement: Element | null = null;

    const refreshTargets = () => {
      announcement = document.querySelector(".announcement");
    };

    const compute = () => {
      raf = 0;
      const next = window.scrollY > SCROLL_THRESHOLD;
      if (scrolledRef.current !== next) {
        scrolledRef.current = next;
        setScrolled(next);
      }
      const el = headerRef.current;
      if (!el) return;
      // getClientRects is empty when the bar is display:none (mobile) or not
      // rendered (non-home pages), so the header falls back to the top.
      const announcementVisible =
        !!announcement && announcement.getClientRects().length > 0;
      el.style.top = announcementVisible
        ? `${Math.max(0, NAV_INITIAL_TOP - window.scrollY)}px`
        : "0px";
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    const handleResize = () => {
      refreshTargets();
      schedule();
    };
    refreshTargets();
    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", handleResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const pillPainted = scrolled || open;

  return (
    <header
      ref={headerRef}
      // Pre-hydration position: below the announcement bar on the home page
      // at lg+ (where the bar renders), at the top everywhere else. After
      // mount the scroll handler owns `top` via an inline style.
      style={
        {
          "--nav-initial-top": isHome ? `${NAV_INITIAL_TOP}px` : "0px",
        } as CSSProperties
      }
      // heynox scroll morph: symmetric padding shrinks 20px → 12px past the
      // threshold (the pill "settles" as it pins), padding alone transitions —
      // `top` tracks the scroll position per frame, so the bar rides the page.
      className={[
        "fixed inset-x-0 top-0 z-50 px-6 transition-[padding] duration-500 ease-out lg:top-[var(--nav-initial-top,0px)]",
        scrolled ? "py-3" : "py-5",
        "max-md:!px-4 max-md:!pt-4 max-md:!pb-0",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto transition-[max-width] duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[max-width]",
          scrolled ? "max-w-[760px]" : "max-w-6xl",
        ].join(" ")}
      >
        {/* Nav pill — logo | links | CTA. Transparent at top, glass on scroll. */}
        <nav
          aria-label="Main"
          className={[
            "grid grid-cols-[1fr_auto_1fr] items-center rounded-full border py-2 pl-3 pr-2 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            "max-md:flex max-md:flex-col max-md:items-stretch max-md:gap-0 max-md:rounded-2xl max-md:px-3 max-md:py-1.5",
            pillPainted
              ? "border-black/[0.06] bg-white/80 shadow-[0_14px_40px_-18px_rgba(24,24,27,0.18),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-[20px] backdrop-saturate-150"
              : "border-transparent bg-transparent max-md:border-black/[0.06] max-md:bg-white/80 max-md:shadow-[0_14px_40px_-18px_rgba(24,24,27,0.18),inset_0_1px_0_rgba(255,255,255,0.7)] max-md:backdrop-blur-[20px] max-md:backdrop-saturate-150",
          ].join(" ")}
        >
          {/* Top row: contents on desktop so the grid owns layout; flex row on mobile. */}
          <div className="[display:contents] max-md:flex max-md:w-full max-md:items-center max-md:justify-between">
            {/* Left — logo */}
            <Link
              href="/"
              className="flex items-center gap-2 justify-self-start px-2 py-1 text-[15px] font-medium tracking-tight1 text-zinc-900 max-md:px-0"
              aria-label="ato-mcp home"
            >
              <Mark />
              ato-mcp
            </Link>

            {/* Centre — links */}
            <div className="group flex items-center gap-1 justify-self-center max-md:hidden">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full px-3 py-1.5 text-[13px] text-zinc-700 opacity-100 transition-opacity duration-200 hover:!opacity-100 group-hover:opacity-40"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Right — CTA */}
            <div className="flex items-center gap-1 justify-self-end">
              <a
                href="/app"
                className="btn btn-primary px-4 py-2 text-[13px] max-md:hidden"
              >
                Open App
              </a>
              {/* Mobile hamburger → ×, inside the pill */}
              <button
                type="button"
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
                className="hidden h-9 w-9 items-center justify-center max-md:flex"
              >
                <span
                  className={[
                    "relative block h-px w-4 rounded bg-zinc-900 transition-colors duration-200",
                    "before:absolute before:left-0 before:top-[-5px] before:h-px before:w-full before:rounded before:bg-zinc-900 before:transition-transform before:duration-300",
                    "after:absolute after:left-0 after:top-[5px] after:h-px after:w-full after:rounded after:bg-zinc-900 after:transition-transform after:duration-300",
                    open
                      ? "bg-transparent before:translate-y-[5px] before:rotate-45 after:translate-y-[-5px] after:-rotate-45"
                      : "",
                  ].join(" ")}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {/* Mobile expandable menu — the pill grows downward (grid-rows trick). */}
          <div
            className={[
              "hidden max-md:grid max-md:transition-[grid-template-rows] max-md:duration-[400ms] max-md:ease-[cubic-bezier(0.22,1,0.36,1)]",
              open
                ? "max-md:visible max-md:grid-rows-[1fr]"
                : "max-md:invisible max-md:grid-rows-[0fr]",
            ].join(" ")}
            aria-hidden={!open}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="flex flex-col gap-0.5 py-2">
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    className="rounded-lg px-3 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50"
                  >
                    {l.label}
                  </Link>
                ))}
                <a
                  href="/app"
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className="btn btn-primary mb-1.5 mt-2 px-4 py-2.5 text-sm"
                >
                  Open App
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
