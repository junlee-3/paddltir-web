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
    title: "What can you actually claim?",
    description:
      "It's late June. You have a dozen ATO tabs open, a folder of receipts, and a quiet suspicion you're leaving money on the table. Every sole trader knows that night.",
    date: "2026-08-04",
    dateLabel: "4 August 2026",
    tag: "Explainer",
    readingTime: "4 min read",
  },
  {
    slug: "its-bas-time-again",
    title: "It's BAS time again",
    description:
      "Every quarter, the same ritual: open the spreadsheet, re-Google what goes at G1, wonder whether that subscription counts, triple-check the due date. You've done this dance a dozen times and it never gets less tense.",
    date: "2026-08-04",
    dateLabel: "4 August 2026",
    tag: "Walkthrough",
    readingTime: "4 min read",
  },
  {
    slug: "so-you-bought-a-laptop-in-the-eofy-sales",
    title: "So you bought a laptop in the EOFY sales",
    description:
      "It's on the desk, it's genuinely for the business, and a voice in the back of your mind says: I can write this off, right?",
    date: "2026-08-04",
    dateLabel: "4 August 2026",
    tag: "Story",
    readingTime: "4 min read",
  },
  {
    slug: "am-i-going-to-get-audited",
    title: "Am I going to get audited?",
    description:
      "You hit lodge in July. The refund lands in August. And somewhere in September, unprompted, the thought arrives: what if they look closely?",
    date: "2026-08-04",
    dateLabel: "4 August 2026",
    tag: "Story",
    readingTime: "3 min read",
  },
  {
    slug: "can-you-trust-ai-with-your-tax",
    title: "Can you trust AI with your tax?",
    description:
      "It's 11pm, you have a tax question, and the chatbot answers instantly, fluently, and with total confidence. The only problem is the year it thinks it is.",
    date: "2026-08-04",
    dateLabel: "4 August 2026",
    tag: "Essay",
    readingTime: "3 min read",
  },
  {
    slug: "nobody-withholds-your-tax-anymore",
    title: "Nobody withholds your tax anymore",
    description:
      "The first invoice clears and it's all there. Every dollar. No tax withheld, no super skimmed, just the full number sitting in your account like a small miracle.",
    date: "2026-08-04",
    dateLabel: "4 August 2026",
    tag: "Story",
    readingTime: "3 min read",
  },
];
