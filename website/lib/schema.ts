/**
 * Shared JSON-LD entity constants. One stable @id per real-world entity so
 * every page's @graph points at the same Organization and Person nodes —
 * AI systems and Google consolidate them instead of seeing fragments.
 */

export const SITE = "https://ato-mcp.com.au";

export const ORG_ID = `${SITE}/#org`;
export const PERSON_ID = `${SITE}/about#william`;

/** Compact author reference for BlogPosting/TechArticle nodes: keeps each
 *  page self-contained (type + name resolve locally) while the shared @id
 *  lets parsers merge it with the full node on /about. */
export function personRef() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "William Laverty",
    url: `${SITE}/about`,
  };
}

/** The full Person node — rendered on /about, the entity's home page. */
export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "William Laverty",
    url: `${SITE}/about`,
    jobTitle: "Software developer",
    worksFor: { "@id": ORG_ID },
    sameAs: ["https://github.com/william-laverty"],
    knowsAbout: [
      "Australian tax law",
      "Model Context Protocol",
      "AI agent tooling",
      "Information retrieval",
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
