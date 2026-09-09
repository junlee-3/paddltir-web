import { AccentThread } from "./AccentThread";

export function HomeAccelerate() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16 sm:py-20" aria-labelledby="accel-h">
      <div className="relative">
        <AccentThread className="left-1/2 hidden h-full -translate-x-1/2 sm:block" />
        <h2
          id="accel-h"
          className="reveal-scroll text-center text-[clamp(1.4rem,2.6vw,2rem)] font-normal leading-[1.15] tracking-tight1 text-zinc-900"
        >
          A week and a phone call, or a scroll and a citation
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="tile reveal-scroll p-6">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-zinc-400">
              The old way
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-600">
              Save the question up, wait days for a callback, take the answer on
              trust.
            </p>
          </div>
          <div className="card reveal-scroll p-6">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-brand-text">
              With your agent
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-700">
              Ask in context, get the answer in seconds, and see the exact ATO
              source behind it.
            </p>
          </div>
        </div>
        <p className="mt-4 text-center font-mono text-[0.625rem] uppercase tracking-[0.05em] text-zinc-400">
          Illustrative — not a benchmarked time or cost claim
        </p>
      </div>
    </section>
  );
}
