import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { CurrentYear } from "./CurrentYear";

const GITHUB = "https://github.com/junlee-3/paddltir-web";

export function Footer() {
  return (
    <footer className="px-3 pb-3">
      {/* pb-7 matches the bottom bar's pt-7 so the space under the label
          equals the space above it (to the divider). */}
      <div className="footer-card overflow-hidden px-6 pb-7 pt-14 sm:px-10 sm:pt-16 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
            {/* Brand group */}
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
                <BrandMark size={28} className="text-zinc-900" />
                <span className="text-[17px] font-medium tracking-tight1 text-zinc-900">
                  Paddltir
                </span>
              </div>
              <p className="mt-5 text-[14.5px] leading-relaxed text-zinc-500">
                <span className="font-medium text-zinc-900">
                  Seat the boat with confidence.
                </span>{" "}
                Manage rosters, build crewlists, configure boats, and read trim
                and balance insights before race day. Source is public so you
                can inspect what runs — use still requires a licence from us.
              </p>
              <p className="mt-4 text-xs leading-relaxed text-zinc-500">
                Crew management for dragon boat clubs. Not affiliated with any
                governing body.
              </p>
            </div>

            {/* Link grid */}
            <nav
              className="grid grid-cols-2 gap-x-10 gap-y-10 lg:gap-x-16"
              aria-label="Footer"
            >
              <div className="flex flex-col gap-3.5">
                <p className="eyebrow">Product</p>
                <Link className="footer-link" href="/install">Get started</Link>
                <Link className="footer-link" href="/docs">Documentation</Link>
                <a className="footer-link" href={GITHUB} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <Link className="footer-link" href="/faq">FAQ</Link>
              </div>
              <div className="flex flex-col gap-3.5">
                <p className="eyebrow">Company</p>
                <Link className="footer-link" href="/guides">Guides</Link>
                <Link className="footer-link" href="/about">About</Link>
                <Link className="footer-link" href="/privacy">Privacy</Link>
                <Link className="footer-link" href="/terms">Terms</Link>
              </div>
            </nav>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 flex flex-col gap-4 border-t border-zinc-200 pt-7 text-[13px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© <CurrentYear /> Jun Lee · All rights reserved</p>
            <p>Crew management for dragon boat clubs.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
