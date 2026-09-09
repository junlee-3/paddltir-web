/**
 * The blog registry — one entry per post, newest first. The /blog index
 * renders this list and the sitemap walks it, so publishing a post is:
 * add its page under app/blog/<slug>/page.tsx, then add an entry here.
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
  /** Shown in the post header meta block, e.g. "5 min read". */
  readingTime: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "what-can-you-actually-claim",
    title: "Who belongs in which seat?",
    description:
      "Race morning, ten paddlers looking at you, and the boat still empty. Here's how to seat a crew without guessing on the pontoon.",
    date: "2026-08-04",
    dateLabel: "4 August 2026",
    tag: "Explainer",
    readingTime: "4 min read",
  },
  {
    slug: "its-bas-time-again",
    title: "It's race weekend again",
    description:
      "Every regatta, the same scramble: who's in, who's scratched, which heat needs a sweep. Here's how to keep the roster calm.",
    date: "2026-08-04",
    dateLabel: "4 August 2026",
    tag: "Walkthrough",
    readingTime: "4 min read",
  },
  {
    slug: "so-you-bought-a-laptop-in-the-eofy-sales",
    title: "So you finally weighed the whole crew",
    description:
      "The numbers are in. Now what? How weight and preferred side change who sits where — and why trim shows up before the start horn.",
    date: "2026-08-04",
    dateLabel: "4 August 2026",
    tag: "Story",
    readingTime: "4 min read",
  },
  {
    slug: "am-i-going-to-get-audited",
    title: "Is this lineup going to tip?",
    description:
      "You locked the heat, then second-guessed it at 6am. Here's how to check balance before you load, not after you bury a gunwale.",
    date: "2026-08-04",
    dateLabel: "4 August 2026",
    tag: "Story",
    readingTime: "3 min read",
  },
  {
    slug: "can-you-trust-ai-with-your-tax",
    title: "Can you trust a spreadsheet with your crew?",
    description:
      "Shared sheets drift. Someone edits the wrong heat. Here's why a dedicated crew tool beats the tab that never quite matches race day.",
    date: "2026-08-04",
    dateLabel: "4 August 2026",
    tag: "Essay",
    readingTime: "3 min read",
  },
  {
    slug: "nobody-withholds-your-tax-anymore",
    title: "Nobody remembers who sat where",
    description:
      "After the final, the lineup is already fog. Here's how to keep a clear record of who raced which heat — and seat the next one faster.",
    date: "2026-08-04",
    dateLabel: "4 August 2026",
    tag: "Story",
    readingTime: "3 min read",
  },
];
