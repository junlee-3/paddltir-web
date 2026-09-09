import type { Metadata } from "next";
import Link from "next/link";
import { HOME_FAQS, EXTRA_FAQS } from "@/lib/faqs";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "FAQ: common questions about ato-mcp",
  description:
    "Is there an MCP server for Australian tax? Is it tax advice? What does it store? Every common question about ato-mcp, answered plainly.",
  alternates: { canonical: "/faq" },
};

const ALL_FAQS = [...HOME_FAQS, ...EXTRA_FAQS];

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: ALL_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    breadcrumbJsonLd([{ name: "FAQ", path: "/faq" }]),
  ],
};

export default function FaqPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 pb-24 pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <p className="eyebrow">FAQ</p>
      <h1 className="mt-3 text-[clamp(2rem,4vw,2.75rem)] font-normal leading-[1.08] tracking-tight2 text-zinc-900">
        Common questions, answered plainly
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-500">
        Everything people ask before connecting their agent. If your question
        isn&apos;t here, the{" "}
        <Link
          href="/docs"
          className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900"
        >
          documentation
        </Link>{" "}
        goes deeper.
      </p>

      <div className="mt-10">
        {ALL_FAQS.map((f) => (
          <details key={f.q} className="group border-b border-zinc-100 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium marker:hidden">
              <h2 className="text-[15px] font-medium">{f.q}</h2>
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

      <div className="mt-12 text-center">
        <a href="/app" className="btn btn-primary px-7 py-3 text-sm">
          Open App
        </a>
      </div>
    </main>
  );
}
