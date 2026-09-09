/**
 * Registry of reference guides — one entry per guide, used by the index and sitemap.
 */
export type Guide = {
  slug: string;
  /** Card/index title: the question the guide answers. */
  title: string;
  description: string;
  /** ISO date of last meaningful content change (sitemap lastmod). */
  date: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "ai-agent-tax-deductions",
    title: "How do you seat a standard boat?",
    description:
      "Left, right, drummer, sweep: a practical order of operations for filling a standard dragon boat without leaving balance to chance.",
    date: "2026-08-17",
  },
  {
    slug: "can-ai-do-my-bas",
    title: "How do you run multiple heats?",
    description:
      "Open, mixed, women's — keep separate lineups for each heat so one change doesn't wipe the next race.",
    date: "2026-08-17",
  },
];
