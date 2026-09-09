"use client";

import { useEffect, useRef } from "react";
import { AccentThread } from "./AccentThread";

const TRACE = [
  { t: "call", name: "get_user_facts", arg: "" },
  { t: "call", name: "deduction_discovery", arg: "occupation: software developer" },
  { t: "call", name: "get_threshold", arg: "working_from_home_fixed_rate" },
  { t: "call", name: "search", arg: '"home office occupancy costs"' },
];

const RECEIPT = [
  { label: "Home office running costs", amt: "$1,240", cite: "ITAA 1997 · s 8-1" },
  { label: "Laptop (immediate write-off)", amt: "$299", cite: "ITAA 1997 · Div 40" },
  { label: "Phone & internet (work share)", amt: "$540", cite: "PCG 2023/1" },
  { label: "Professional subscriptions", amt: "$180", cite: "TR 93/30" },
];

function WinBar({ label }: { label: string }) {
  return (
    <div className="win-chrome">
      <span className="win-dot" />
      <span className="win-dot" />
      <span className="win-dot" />
      <span className="ml-2 font-mono text-[0.6875rem] text-zinc-400">{label}</span>
    </div>
  );
}

/** Beat 1 — receipts/bank statements drifting toward the terminal. */
function BeatIngest() {
  return (
    <div className="demo-beat">
      <div className="card overflow-hidden">
        <WinBar label="Finder — Tax 2024-25" />
        <div className="relative flex min-h-[260px] items-center justify-center gap-6 p-8">
          {["bank-statement.pdf", "receipts.csv", "invoice.pdf"].map((f, i) => (
            <div
              key={f}
              className="demo-file tile flex h-24 w-20 flex-col items-center justify-center gap-2 p-2"
              data-i={i}
            >
              <svg width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden="true">
                <path d="M1 1h13l7 7v17H1z" stroke="#d4d4d8" />
                <path d="M14 1v7h7" stroke="#d4d4d8" />
              </svg>
              <span className="text-center font-mono text-[0.5625rem] text-zinc-400">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Beat 2 — the Claude Code CLI trace with real MCP tool calls. */
function BeatTrace() {
  return (
    <div className="demo-beat">
      <div className="card overflow-hidden">
        <WinBar label="claude — ato-mcp" />
        <div className="space-y-1.5 bg-zinc-50 p-5 font-mono text-[0.75rem] leading-relaxed text-zinc-600">
          <p className="text-zinc-400">› find every deduction I can claim this year</p>
          {TRACE.map((c) => (
            <p key={c.name} className="demo-trace-line flex items-center gap-2">
              <span className="text-brand-text">⏺</span>
              <span className="text-zinc-900">{c.name}</span>
              {c.arg && <span className="text-zinc-400">({c.arg})</span>}
            </p>
          ))}
          <p className="demo-trace-line text-zinc-400">✓ 4 ATO sources checked · 32 categories matched to your profile</p>
        </div>
      </div>
    </div>
  );
}

/** Beat 3 — the running receipt/tally, each line cited. */
function BeatReceipt() {
  return (
    <div className="demo-beat">
      <div className="card overflow-hidden">
        <WinBar label="Deductions found" />
        <div className="p-5">
          <ul className="divide-y divide-zinc-100">
            {RECEIPT.map((r) => (
              <li key={r.label} className="demo-receipt-line flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm text-zinc-800">{r.label}</p>
                  <span className="chip mt-1">
                    <span className="chip-dot" />
                    {r.cite}
                  </span>
                </div>
                <span className="font-mono text-sm text-zinc-900">{r.amt}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3">
            <span className="text-sm font-medium text-zinc-900">Total deductions</span>
            <span className="font-mono text-sm font-medium text-brand-text">$2,259</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Beat 4 — the ATO-style summary; estimated tax payable drops to the payoff. */
function BeatPayoff() {
  return (
    <div className="demo-beat">
      <div className="card overflow-hidden">
        <WinBar label="my.gov.au — Tax estimate" />
        <div className="p-8">
          <p className="text-sm text-zinc-500">Estimated tax payable</p>
          <p className="mt-2 flex items-baseline gap-3">
            <span className="font-mono text-2xl text-zinc-300 line-through">$14,820</span>
            <span
              className="demo-payoff font-mono text-4xl tracking-tight1 text-zinc-900"
              data-from="14820"
              data-to="12561"
            >
              $12,561
            </span>
          </p>
          <p className="mt-3 text-sm text-brand-text">↓ $2,259 in cited deductions applied</p>
        </div>
      </div>
    </div>
  );
}

export function HomeScrollDemo() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let mm: gsap.MatchMedia | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, stMod] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const beats = gsap.utils.toArray<HTMLElement>(".demo-beat", stage);
          // noUncheckedIndexedAccess: narrow the four expected beats once,
          // up front, instead of re-checking on every indexed access below.
          const [beat0, beat1, beat2, beat3] = beats;
          if (!beat0 || !beat1 || !beat2 || !beat3) return undefined;

          // Stack the beats absolutely inside a viewport-height stage.
          gsap.set(stage, { height: "80vh" });
          gsap.set(beats, {
            position: "absolute",
            inset: 0,
            margin: "auto",
            height: "max-content",
            maxWidth: "48rem",
            left: 0,
            right: 0,
            autoAlpha: 0,
            yPercent: 6,
          });
          gsap.set(beat0, { autoAlpha: 1, yPercent: 0 });

          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: "+=3200",
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
            },
          });

          // Beat 1 → intra-beat: files drift toward centre.
          tl.to(stage.querySelectorAll(".demo-file"), {
            x: (i: number) => (1 - i) * 40,
            y: 8,
            opacity: 0.35,
            stagger: 0.05,
          });

          // Crossfade helper between consecutive beats.
          const advance = (from: HTMLElement, to: HTMLElement) => {
            tl.to(from, { autoAlpha: 0, yPercent: -6 }, ">");
            tl.fromTo(to, { autoAlpha: 0, yPercent: 6 }, { autoAlpha: 1, yPercent: 0 }, "<");
          };

          advance(beat0, beat1);
          tl.from(stage.querySelectorAll(".demo-trace-line"), {
            autoAlpha: 0,
            x: -8,
            stagger: 0.12,
          });

          advance(beat1, beat2);
          tl.from(stage.querySelectorAll(".demo-receipt-line"), {
            autoAlpha: 0,
            y: 10,
            stagger: 0.12,
          });

          advance(beat2, beat3);
          const payoff = stage.querySelector<HTMLElement>(".demo-payoff");
          if (payoff) {
            const from = Number(payoff.dataset.from ?? "0");
            const to = Number(payoff.dataset.to ?? "0");
            const obj = { v: from };
            tl.to(obj, {
              v: to,
              snap: { v: 1 },
              onUpdate: () => {
                payoff.textContent = `$${Math.round(obj.v).toLocaleString("en-AU")}`;
              },
            });
          }

          return () => {
            // matchMedia reverts gsap.set/tween styles automatically; also kill
            // the ScrollTrigger created above.
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        },
      );
    })();

    return () => {
      cancelled = true;
      mm?.revert();
    };
  }, []);

  return (
    <section className="relative px-3 py-8 sm:py-12" aria-labelledby="demo-h">
      <div className="mx-auto max-w-5xl">
        <h2
          id="demo-h"
          className="reveal-scroll mx-auto max-w-2xl text-center text-[clamp(1.6rem,3vw,2.25rem)] font-normal leading-[1.1] tracking-tight1"
        >
          Drop in your paperwork, watch the deductions add up
        </h2>
        <p className="reveal-scroll mx-auto mt-4 max-w-xl text-center text-[15px] leading-relaxed text-zinc-500">
          Your agent reads your files, calls the tax tools, and totals what you
          can claim — every line traceable to its ATO source.
        </p>

        <div ref={stageRef} className="demo-stage relative mt-12">
          <AccentThread className="left-1/2 hidden h-full -translate-x-1/2 lg:block" />
          <div className="space-y-6 lg:space-y-8">
            <BeatIngest />
            <BeatTrace />
            <BeatReceipt />
            <BeatPayoff />
          </div>
        </div>
      </div>
    </section>
  );
}
