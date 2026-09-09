/**
 * Shared JSON-LD entity constants. One stable @id per real-world entity so
 * every page's @graph points at the same Organization and Person nodes —
 * AI systems and Google consolidate them instead of seeing fragments.
 */

export const SITE = "https://paddltir-web.vercel.app";

export const ORG_ID = `${SITE}/#org`;
export const PERSON_ID = `${SITE}/about#jun`;

/** Compact author reference for BlogPosting/TechArticle nodes: keeps each
 *  page self-contained (type + name resolve locally) while the shared @id
 *  lets parsers merge it with the full node on /about. */
export function personRef() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Jun Lee",
    url: `${SITE}/about`,
  };
}

/** The full Person node — rendered on /about, the entity's home page. */
export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Jun Lee",
    url: `${SITE}/about`,
    jobTitle: "Software developer",
    worksFor: { "@id": ORG_ID },
    sameAs: ["https://github.com/junlee-3"],
    knowsAbout: [
      "Dragon boat racing",
      "Crew management",
      "Sports analytics",
      "Boat configuration",
    ],
  };
}

/** speakable hint for assistants — pass the selectors for the title and lede. */
export function speakable(cssSelector: string[]) {
  return {
    "@type": "SpeakableSpecification",
    cssSelector,
  };
}
