import type { Metadata } from "next";
import { HOME_FAQS, EXTRA_FAQS } from "@/lib/faqs";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { speakable } from "@/lib/schema";
import { ClosingCta } from "@/components/site/ClosingCta";

export const metadata: Metadata = {
  title: "FAQ: common questions",
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
      speakable: speakable(["main h1", "main h2"]),
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
    <>
    <main className="mx-auto min-h-screen max-w-5xl px-5 pb-24 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <div className="mx-auto max-w-3xl">

        <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-normal leading-[1.08] tracking-tight2 text-zinc-900">
          Common questions, answered plainly
        </h1>

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

      </div>
    </main>
    <ClosingCta />
    </>
  );
}
