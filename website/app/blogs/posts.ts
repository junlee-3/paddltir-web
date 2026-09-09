/**
 * The blog registry — one entry per post, newest first. The /blogs index
 * renders this list and the sitemap walks it, so publishing a post is:
 * add its page under app/blogs/<slug>/page.tsx, then add an entry here.
 */
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** ISO date, used for <time dateTime> and the sitemap. */
  date: string;
  /** Human-readable date shown on the card. */
  dateLabel: string;
  /** Short category label, e.g. "Product update". */
  tag: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "the-new-ato-mcp",
    title: "The new ato-mcp: more data, sharper answers, setup in seconds",
    description:
      "Our biggest release since launch: sign in with your browser (no tokens), a personal facts layer so your agent understands you, and a rebuilt corpus of 34,564 documents and 286,638 passages with measurably better search.",
    date: "2026-07-04",
    dateLabel: "4 July 2026",
    tag: "Product update",
  },
];
