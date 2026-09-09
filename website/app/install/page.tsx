import type { Metadata } from "next";
import Link from "next/link";
import InstallPicker from "@/components/InstallPicker";
import { INSTALL_CLIENTS } from "@/lib/install-clients";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "Install: one line, sign in with your browser",
  description:
    "Add ato-mcp to Claude Code, Codex, Gemini CLI, Cursor, VS Code or any MCP client with one command, then sign in via your browser. No token setup.",
  alternates: { canonical: "/install" },
};

const installJsonLd = {
  "@context": "https://schema.org",
  ...breadcrumbJsonLd([{ name: "Install", path: "/install" }]),
};

export default function InstallPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(installJsonLd) }}
      />
      <p className="eyebrow">Install</p>
      <h1 className="mt-3 text-[clamp(2rem,4vw,2.75rem)] font-normal leading-[1.08] tracking-tight2">
        One line. Sign in with your browser. Done.
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-500">
        Pick your client, run the command (or paste the config), then approve access when your
        browser opens. Your account is created on first sign-in, no token to copy.
      </p>

      <div className="card mt-10 p-6">
        <InstallPicker />
      </div>

      <p className="mt-6 text-[13px] text-zinc-500">
        On a stdio-only client that doesn&apos;t speak remote MCP? Pick{" "}
        <span className="font-medium text-zinc-900">Other / any MCP client</span> above for the
        npm-package fallback. After connecting, complete your{" "}
        <Link
          href="/account/facts/edit"
          className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900"
        >
          tax profile
        </Link>{" "}
        so the workflow tools know your situation.
      </p>

      {/* Per-client reference: the same instructions as the picker, laid out
          as one section per client so each is directly linkable and readable
          without JS. */}
      <section className="mt-16" aria-label="Install instructions per client">
        <p className="eyebrow">Every client, written out</p>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-500">
          The same instructions as the picker above, one section per client.
        </p>
        <div className="mt-8 space-y-10">
          {INSTALL_CLIENTS.map((c) => (
            <div key={c.id} id={`install-${c.id}`}>
              <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
                Install ato-mcp in {c.name}
              </h2>
              {c.configPath && (
                <p className="mt-2 text-[13px] text-zinc-500">
                  Add to <code className="font-mono text-zinc-900">{c.configPath}</code>:
                </p>
              )}
              <pre className="code-block mt-3 whitespace-pre-wrap">{c.snippet}</pre>
              <p className="mt-3 text-[13px] leading-relaxed text-zinc-600">
                <span className="font-medium text-zinc-900">Then authenticate:</span>{" "}
                {c.authNote}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
