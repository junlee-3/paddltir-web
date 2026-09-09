"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { trackEvent } from "@/lib/analytics";
const LINKS = [
  { href: "/about", label: "About" },
  { href: "/docs", label: "Docs" },
  { href: "/faq", label: "FAQ" },
];

const SCROLL_THRESHOLD = 50;

// Initial fixed-header offset on the home page (lg+): the pill rests 10px
// lower than its pinned position and rides up 1:1 with the page
// (top = max(0, 10 − scrollY)) until it pins, where the padding morph takes
// over as the scrolled state.
const NAV_INITIAL_TOP = 10;

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

  // Shared scroll apply: updates pill morph + home offset from a scrollY value.
  const applyScroll = useCallback(
    (y: number) => {
      const next = y > SCROLL_THRESHOLD;
      if (scrolledRef.current !== next) {
        scrolledRef.current = next;
        setScrolled(next);
      }
      const el = headerRef.current;
      if (!el) return;
      const offsetActive =
        isHome && window.matchMedia("(min-width: 1024px)").matches;
      el.style.top = offsetActive
        ? `${Math.max(0, NAV_INITIAL_TOP - y)}px`
        : "0px";
    },
    [isHome],
  );

  // Lenis path (when smooth scroll is active).
  useLenis(
    (lenis) => {
      applyScroll(lenis.scroll);
    },
    [applyScroll],
  );

  // IntersectionObserver sentinel: reliable even when Lenis owns scrolling or
  // native scroll events don't reach window listeners. A 1px marker at the
  // document top leaves the viewport once scrollY passes SCROLL_THRESHOLD.
  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("data-nav-scroll-sentinel", "");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;width:1px;height:1px;visibility:hidden;pointer-events:none;";
    document.body.prepend(sentinel);

    const io = new IntersectionObserver(
      ([entry]) => {
        applyScroll(entry.isIntersecting ? 0 : SCROLL_THRESHOLD + 1);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: `-${SCROLL_THRESHOLD}px 0px 0px 0px`,
      },
    );
    io.observe(sentinel);

    // Keep home offset tracking continuous (IO only flips the boolean).
    let raf = 0;
    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          const y = window.scrollY || document.documentElement.scrollTop;
          if (isHome) applyScroll(y);
        });
      }
    };
    applyScroll(window.scrollY || document.documentElement.scrollTop);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      sentinel.remove();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname, applyScroll, isHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Pill chrome is always painted; scroll still drives the width morph.
  const pillPainted = true;

  return (
    <header
      ref={headerRef}
      // Pre-hydration position: offset down on the home page at lg+, at the
      // top everywhere else. After mount the scroll handler owns `top` via
      // an inline style.
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
        // Mobile: 24px outer padding = the card's 12px inset + 12px breathing
        // room, so the pill floats consistently inside the glass container.
        "max-md:!px-6 max-md:!pt-6 max-md:!pb-0",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto transition-[max-width] duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[max-width]",
          // Resting width tracks the hero content edge: card inset (12px) +
          // hero px clamp, minus the pill's internal left offset (pl-3 +
          // logo px-2 = 20px) so the logo mark sits flush on the headline.
          scrolled
            ? "max-w-[760px]"
            : "max-w-6xl md:max-w-[calc(100vw_+_16px_-_2*clamp(24px,7vw,88px))]",
        ].join(" ")}
      >
        {/* Nav pill — logo | links | CTA. Transparent at top, glass on scroll. */}
        <nav
          aria-label="Main"
          className={[
            "grid grid-cols-[1fr_auto_1fr] items-center rounded-full border py-2 pl-3 pr-2 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            "max-md:flex max-md:flex-col max-md:items-stretch max-md:gap-0 max-md:rounded-[24px] max-md:px-3 max-md:py-1.5",
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
              aria-label="Paddltir home"
            >
              <Mark />
              Paddltir
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
                onClick={() => trackEvent("connect_cta_clicked", { location: "nav" })}
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
                  onClick={() => {
                    trackEvent("connect_cta_clicked", { location: "nav_mobile" });
                    setOpen(false);
                  }}
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
