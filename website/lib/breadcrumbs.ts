/** BreadcrumbList JSON-LD for the static pages (Google breadcrumb rich results). */

const SITE = "https://paddltir-web.vercel.app";

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      // No trailing slash: matches the homepage's rendered canonical.
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      ...trail.map((crumb, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: crumb.name,
        item: `${SITE}${crumb.path}`,
      })),
    ],
  };
}
