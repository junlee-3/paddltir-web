import type { Metadata } from "next";
import { HomeAccelerate } from "../components/site/home/HomeAccelerate";
import { HomeCorpus } from "../components/site/home/HomeCorpus";
import { HomeCta } from "../components/site/home/HomeCta";
import { HomeFaq } from "../components/site/home/HomeFaq";
import { HomeHero } from "../components/site/home/HomeHero";
import { HomeScrollDemo } from "../components/site/home/HomeScrollDemo";
import { HomeSession } from "../components/site/home/HomeSession";
import { HOME_FAQS } from "../lib/faqs";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/* ---------------------------------------------------------------------------
   Landing page — Clinical system. Fully light: white sections alternating
   with zinc-50 bands, hairline borders, one vermillion accent reserved for
   citation chips and small markers. A thin composition of Home* section
   components, in render order below.
--------------------------------------------------------------------------- */

const FAQS = HOME_FAQS;

const SITE = "https://ato-mcp.com.au";

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "ato-mcp",
      operatingSystem: "macOS, Linux, Windows",
      applicationCategory: "DeveloperApplication",
      description:
        "MCP server providing Australian tax knowledge for AI agents. Cited retrieval over 34,500+ ATO documents with personal context to answer any tax question.",
      url: SITE,
      downloadUrl: "https://www.npmjs.com/package/ato-mcp",
      softwareVersion: "1.1.0",
      offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
      license: "https://github.com/william-laverty/ato-mcp/blob/main/LICENSE",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* ------------------------------------------------ hero */}
      <HomeHero />

      {/* ------------------------------------------------ scroll demo (four-beat product story) */}
      <HomeScrollDemo />

      {/* ------------------------------------------------ accelerate (illustrative days vs seconds) */}
      <HomeAccelerate />

      {/* ------------------------------------------------ the session */}
      <HomeSession />

      {/* ------------------------------------------------ corpus */}
      <HomeCorpus />

      {/* ------------------------------------------------ FAQ */}
      <HomeFaq />

      {/* ------------------------------------------------ final CTA
          On plain white with a faint glow + deep bottom padding so it melts
          into the page; the floating footer card below then reads as an inset
          panel overlaying the extended bottom of the CTA (pluck pattern). */}
      <HomeCta />
    </main>
  );
}
