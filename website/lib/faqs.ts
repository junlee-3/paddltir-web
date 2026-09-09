/** FAQ content shared by the homepage accordion and /faq. Answers are plain
 *  strings so the same text feeds the visible copy and FAQPage JSON-LD. */

export interface Faq {
  q: string;
  a: string;
}

export const HOME_FAQS: Faq[] = [
  {
    q: "Is this tax advice?",
    a: "No. ato-mcp retrieves published ATO material and runs fixed calculations, always with the source attached. Confidence ratings and risk bands are guides, not professional judgement. Your agent does the reasoning, and decisions that matter should still go past a registered tax agent.",
  },
  {
    q: "What does ato-mcp store about me?",
    a: "Your onboarding facts (business structure, GST registration and so on, about 25 fields you control), your sign-in identity, and basic usage counts. Never tool names, never query content, never results: the database physically has nowhere to store them, and the privacy page is generated from that same schema so it can't drift.",
  },
  {
    q: "Which agents does it work with?",
    a: "Anything that speaks the Model Context Protocol: Claude, ChatGPT, Codex, Gemini CLI, Cursor, VS Code and more. One line to install, then sign in with your browser.",
  },
  {
    q: "Is there an MCP server for Australian tax?",
    a: "Yes. ato-mcp is an MCP server for Australian tax: it gives any agent that speaks the Model Context Protocol (Claude, ChatGPT, Codex, Gemini CLI, Cursor, VS Code) cited retrieval over 34,500+ ATO documents, the income tax and GST Acts and 4,900+ public rulings.",
  },
  {
    q: "What is MCP (the Model Context Protocol)?",
    a: "MCP is the open standard AI agents use to call outside tools and data sources. ato-mcp uses it to hand your agent 13 Australian tax tools: search over the corpus, statutory definitions, current rates and thresholds, and four workflow tools, with every answer carrying its ATO citation.",
  },
  {
    q: "How current is the corpus?",
    a: "The corpus is rebuilt from ato.gov.au, the Federal Register of Legislation and law.ato.gov.au on a monthly cycle and served fresh. The stats tool reports the live snapshot.",
  },
  {
    q: "Is it open source?",
    a: "Most clients connect directly to the hosted endpoint with no local code at all. The optional npm client is open source (AGPL-3.0) and public, so you can verify exactly what it does. The hosted retrieval platform and the corpus are maintained privately.",
  },
];

export const EXTRA_FAQS: Faq[] = [
  {
    q: "What sources does it search?",
    a: "Three: ato.gov.au guidance, the legislation itself (the ITAA 1997, ITAA 1936 and GST Act, section by section, with 2,310 statutory definitions) and 4,900+ ATO public rulings across ten series, with withdrawn rulings flagged. The corpus is rebuilt monthly and served fresh.",
  },
  {
    q: "What can my agent actually do with it?",
    a: "Thirteen tools. Nine retrieval tools cover search, whole documents, statutory definitions, current rates and thresholds and the citation graph. A personal-context tool carries your tax profile into every answer. Four workflow tools handle deduction discovery, depreciation schedules, BAS preparation and audit-risk checks, all cited.",
  },
  {
    q: "How do I install it?",
    a: "One line in your client, or a short config paste, then sign in with your browser. Your account is created on first sign-in and there is no token to copy. The install page has the exact command for each client.",
  },
  {
    q: "Do I need to be a developer?",
    a: "No. If you can paste a command and sign in with your browser, you can connect ato-mcp. The install page walks through each client step by step.",
  },
  {
    q: "Does it know my situation?",
    a: "If you want it to. You can save a tax profile (about 25 fields: business structure, GST registration and so on) that your agent reads once per session, so answers fit a sole trader registered for GST rather than a generic taxpayer. It's optional, and you control every field.",
  },
  {
    q: "Can I delete my data?",
    a: "Yes. Account deletion removes your profile and sign-in identity. There are no stored queries or results to delete, because the database has nowhere to put them. The privacy page lists every stored field, generated from the schema itself.",
  },
];
