import type { Metadata } from "next";
import InstallPicker from "@/components/InstallPicker";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { MCP_URL } from "@/lib/install-clients";

export const metadata: Metadata = {
  title: "Install: one line, sign in, done",
  description:
    "Add ato-mcp to Claude Code, Codex, Gemini CLI, Cursor, VS Code or any MCP client with one command, then sign in via your browser. No token setup.",
  alternates: { canonical: "/install" },
};

const installJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "Install ato-mcp in an MCP client",
      description:
        "Connect an AI agent to the Australian Tax MCP server: add the remote endpoint to your MCP client, then sign in with your browser.",
      totalTime: "PT2M",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Add the server",
          text: `Add the remote MCP endpoint ${MCP_URL} to your client: one command in Claude Code, Codex or Gemini CLI, a config entry in Cursor or Windsurf, or a custom connector in Claude.ai and ChatGPT.`,
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Sign in with your browser",
          text: "Authenticate when your client asks: your browser opens to sign in with email or Google, and your account is created on first sign-in. No token setup.",
        },
      ],
    },
    breadcrumbJsonLd([{ name: "Install", path: "/install" }]),
  ],
};

export default function InstallPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(installJsonLd) }}
      />
      <h1
        className="reveal-lcp text-[clamp(2rem,5vw,3rem)] font-normal leading-[1.06] tracking-tight2 text-zinc-900"
        style={{ "--reveal-delay": "0s" } as React.CSSProperties}
      >
        Make your agent actually know tax.
      </h1>

      <div className="reveal mt-10 sm:mt-12" style={{ "--reveal-delay": "0.24s" } as React.CSSProperties}>
        <InstallPicker />
      </div>
    </main>
  );
}
