import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { personJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About: who builds it and why",
  description:
    "ato-mcp is an independent Australian project: an MCP server giving AI agents cited answers from 34,500+ ATO documents. Who builds it and why it exists.",
  alternates: { canonical: "/about" },
};

const SITE = "https://ato-mcp.com.au";

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      url: `${SITE}/about`,
      name: "About ato-mcp",
      mainEntity: { "@id": `${SITE}/#org` },
    },
    personJsonLd(),
    breadcrumbJsonLd([{ name: "About", path: "/about" }]),
  ],
};

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 pb-24 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <div className="mx-auto max-w-3xl space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-normal tracking-tight1 text-zinc-900">
            About ato-mcp
          </h1>
          <p className="text-[15px] leading-relaxed text-zinc-500">
            The Australian tax knowledge base for AI agents, built in
            Australia, run independently.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            What it is
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            ato-mcp is an MCP (Model Context Protocol) server that connects
            your AI agent to 34,500+ ATO documents, the income tax and GST
            Acts and 4,900+ public rulings. Your agent already answers
            Australian tax questions; connected to ato-mcp, it answers them
            from the actual law, with the citation to prove it.
          </p>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            It exists because doing your own tax is stressful. The answers are
            published, but they sit across thousands of pages, rulings and
            thresholds, and finding them takes hours. A general chatbot gives
            you a plausible answer with no source, and you can&apos;t act on
            &quot;probably&quot;. ato-mcp gives your agent the source.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            Who builds it
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            ato-mcp is designed, built and run by{" "}
            <a
              href="https://github.com/junlee-3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900"
            >
              Jun Lee
            </a>
            , an Australian software developer. It is a small, independent
            product, not a company with a sales team, and the site doesn&apos;t
            pretend otherwise: no invented testimonials, no made-up user
            counts. The npm client records over 100,000 downloads a month (a
            registry count that includes mirrors and CI, so treat it as reach,
            not a user count). The corpus numbers on this site are real and the{" "}
            <a
              href="https://github.com/junlee-3/paddltir-web"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900"
            >
              client code is public
            </a>
            , so you can check both.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            Why you can trust the answers
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-zinc-700">
            <li>
              Every answer cites its sources: the legislation section, the
              ruling, the ato.gov.au page. You (or your accountant) can check
              any claim against the document behind it.
            </li>
            <li>
              The corpus is rebuilt monthly from ato.gov.au, the Federal
              Register of Legislation and law.ato.gov.au, and withdrawn
              rulings are flagged so your agent never leans on dead guidance.
            </li>
            <li>
              The npm client is open source (AGPL-3.0): you can read exactly
              what runs on your machine.
            </li>
            <li>
              Privacy is structural, not a promise. The database has no column
              for your queries, tool calls or results, and the{" "}
              <Link
                href="/privacy"
                className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900"
              >
                privacy page
              </Link>{" "}
              is generated from that schema.
            </li>
          </ul>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            And the honest limit: ato-mcp is information infrastructure, not
            tax advice. It retrieves published material and runs fixed,
            cited calculations. Decisions that matter should still go past a
            registered tax agent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            Independence
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            ato-mcp is an independent service. It is not affiliated with,
            endorsed by, or operated by the Australian Taxation Office. ATO
            content remains subject to ATO publication terms.
          </p>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            A note on the name: an unrelated MCP package by another developer
            (an ATO statistics server) also appears as ato-mcp in some
            directories. This site, api.ato-mcp.com.au and the npm package{" "}
            <a
              href="https://www.npmjs.com/package/ato-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900"
            >
              ato-mcp
            </a>{" "}
            are the Australian tax knowledge base described here.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            Contact
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            Product questions and bug reports:{" "}
            <a
              href="https://github.com/junlee-3/paddltir-web/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900"
            >
              GitHub issues
            </a>
            . Privacy and data requests:{" "}
            <a
              href="mailto:privacy@ato-mcp.com.au"
              className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900"
            >
              privacy@ato-mcp.com.au
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
