/**
 * Registry of reference guides (question-form, extractable, cited) — the
 * /guides analogue of app/blog/posts.ts. The index page, sitemap and blog
 * cross-links all read from here so a new guide only gets added once.
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
    title: "Can AI find your tax deductions?",
    description:
      "What a connected agent can do for a sole trader in 2025-26: cited deduction categories, records to keep, and the honest limits.",
    date: "2026-08-17",
  },
  {
    slug: "can-ai-do-my-bas",
    title: "Can AI do your BAS?",
    description:
      "What an agent prepares and what you still lodge: the labels that apply, the evidence to gather, and the due dates, all cited.",
    date: "2026-08-17",
  },
];
