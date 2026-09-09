/** Website-facing tool summaries. Full reference: docs/tools.md in the repo. */

export interface ToolMeta {
  name: string;
  /** Human title for display (the mono `name` stays in the example). */
  title: string;
  group: "Retrieval" | "Personal context" | "Workflows";
  summary: string;
  example: string;
}

export const TOOLS_META: ToolMeta[] = [
  {
    name: "search",
    title: "Search",
    group: "Retrieval",
    summary: "Runs hybrid keyword and semantic retrieval over the whole corpus, rank-fused and point-in-time aware.",
    example: `search({ query: "instant asset write-off eligibility", k: 5 })`,
  },
  {
    name: "get_chunks",
    title: "Get Chunks",
    group: "Retrieval",
    summary: "Resolves chunk_ids to full passages, with optional neighbouring context.",
    example: `get_chunks({ chunk_ids: ["legis:…/8-1#0"], neighbours: 1 })`,
  },
  {
    name: "get_doc",
    title: "Get Doc",
    group: "Retrieval",
    summary: "Fetches a whole document: metadata, full text in reading order, and its anchor list.",
    example: `get_doc({ doc_id: "legis:c2004a05138/8-1" })`,
  },
  {
    name: "get_doc_anchors",
    title: "Get Doc Anchors",
    group: "Retrieval",
    summary: "Returns the citation graph around a document: anchors, inbound and outbound references.",
    example: `get_doc_anchors({ doc_id: "legis:c2004a05138/8-1" })`,
  },
  {
    name: "get_definition",
    title: "Get Definition",
    group: "Retrieval",
    summary: "Returns statutory definitions (ITAA 1997 Dictionary and friends), point-in-time selectable.",
    example: `get_definition({ term: "depreciating asset" })`,
  },
  {
    name: "get_threshold",
    title: "Get Threshold",
    group: "Retrieval",
    summary: "Returns time-keyed scalar facts: the IAWO limit, GST registration threshold, CGT discount and super caps.",
    example: `get_threshold({ name: "instant_asset_write_off" })`,
  },
  {
    name: "fetch",
    title: "Fetch",
    group: "Retrieval",
    summary: "Live-fetches a page by URI scheme (ato:, ato-law:, legis:) when freshness matters.",
    example: `fetch({ uri: "ato:tax-rates-and-codes/…" })`,
  },
  {
    name: "stats",
    title: "Stats",
    group: "Retrieval",
    summary: "Returns a live corpus snapshot: document counts and the schema version.",
    example: `stats({})`,
  },
  {
    name: "get_user_facts",
    title: "Get User Facts",
    group: "Personal context",
    summary: "Returns your onboarded profile: 25 facts the agent reads once per session instead of re-asking.",
    example: `get_user_facts({})`,
  },
  {
    name: "deduction_discovery",
    title: "Deduction Discovery",
    group: "Workflows",
    summary: "Surfaces every plausibly-applicable deduction category for your taxpayer shape, cited and confidence-rated.",
    example: `deduction_discovery({ activity: "bought a laptop" })`,
  },
  {
    name: "depreciation_helper",
    title: "Depreciation Helper",
    group: "Workflows",
    summary: "Computes prime-cost, diminishing-value, IAWO, pool and Div 43 schedules deterministically.",
    example: `depreciation_helper({ asset_cost: 4800, acquisition_date: "2025-09-01", effective_life_years: 3 })`,
  },
  {
    name: "bas_prep_checklist",
    title: "BAS Prep Checklist",
    group: "Workflows",
    summary: "Builds a tiered, cited BAS checklist for your reporting period: labels, evidence, gotchas.",
    example: `bas_prep_checklist({ period_type: "quarterly", quarter: 2 })`,
  },
  {
    name: "audit_risk_check",
    title: "Audit Risk Check",
    group: "Workflows",
    summary: "Runs heuristic ATO red-flags over a draft return, risk-banded with the guidance behind each.",
    example: `audit_risk_check({ income: 90000, deductions: [...] })`,
  },
];
