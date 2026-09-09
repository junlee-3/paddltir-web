import Link from "next/link";
import { HOME_FAQS } from "../../../lib/faqs";

export function HomeFaq() {
  return (
    <section
      className="mx-auto max-w-3xl px-5 pb-20 sm:pb-24"
      aria-labelledby="faq-h"
    >
      <h2
        id="faq-h"
        className="text-center text-[clamp(1.6rem,3vw,2.25rem)] font-normal tracking-tight1"
      >
        Before you connect
      </h2>
      <div className="mt-10">
        {HOME_FAQS.map((f) => (
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
  );
}
