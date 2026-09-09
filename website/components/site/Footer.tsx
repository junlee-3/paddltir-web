import Link from "next/link";

const GITHUB = "https://github.com/william-laverty/ato-mcp";
const NPM = "https://www.npmjs.com/package/ato-mcp";

// MCP hosts ato-mcp connects to — shown as neutral pills in the brand group,
// mirroring pluck's "Works with your agent" chip row.
const AGENTS = ["Claude", "ChatGPT", "Cursor", "Codex", "Gemini CLI", "VS Code", "Any MCP host"];

function Mark({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="30" height="30" rx="8.5" fill="#fa520f" />
      <circle cx="10.5" cy="16" r="2.6" fill="#ffffff" />
      <rect x="15" y="13.9" width="7.5" height="4.2" rx="2.1" fill="#ffffff" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="px-3 pb-3">
      {/* pb-7 matches the bottom bar's pt-7 so the space under the label
          equals the space above it (to the divider). */}
      <div className="footer-card overflow-hidden px-6 pb-7 pt-14 sm:px-10 sm:pt-16 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
            {/* Brand group */}
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
                <Mark size={26} />
                <span className="text-[17px] font-medium tracking-tight1 text-zinc-900">
                  ato-mcp
                </span>
              </div>
              <p className="mt-5 text-[14.5px] leading-relaxed text-zinc-500">
                <span className="font-medium text-zinc-900">
                  Every answer, cited.
                </span>{" "}
                Connect your AI agent to 34,500+ ATO documents, the income tax
                and GST Acts and 4,900+ public rulings. The client is open
                source, so you can read exactly what runs on your machine.
              </p>
              <p className="mt-4 text-xs leading-relaxed text-zinc-400">
                Information infrastructure, not tax advice. Verify material
                decisions with a registered tax agent.
              </p>
              <div className="mt-6">
                <p className="eyebrow mb-3">Works with your agent</p>
                <div className="flex flex-wrap gap-2">
                  {AGENTS.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Link grid */}
            <nav
              className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 lg:gap-x-16"
              aria-label="Footer"
            >
              <div className="flex flex-col gap-3.5">
                <p className="eyebrow">Product</p>
                <Link className="footer-link" href="/docs">Documentation</Link>
                <Link className="footer-link" href="/install">Get started</Link>
                <Link className="footer-link" href="/compare">Compare</Link>
                <Link className="footer-link" href="/faq">FAQ</Link>
                <Link className="footer-link" href="/blogs">What&apos;s new</Link>
              </div>
              <div className="flex flex-col gap-3.5">
                <p className="eyebrow">Open source</p>
                <a className="footer-link" href={GITHUB} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a className="footer-link" href={NPM} target="_blank" rel="noopener noreferrer">
                  npm
                </a>
                <a className="footer-link" href={`${GITHUB}/releases`} target="_blank" rel="noopener noreferrer">
                  Releases
                </a>
              </div>
              <div className="flex flex-col gap-3.5">
                <p className="eyebrow">Company</p>
                <Link className="footer-link" href="/about">About</Link>
                <Link className="footer-link" href="/privacy">Privacy</Link>
                <Link className="footer-link" href="/terms">Terms</Link>
                <a className="footer-link" href={`${GITHUB}/blob/main/SECURITY.md`} target="_blank" rel="noopener noreferrer">
                  Security
                </a>
              </div>
            </nav>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 flex flex-col gap-4 border-t border-zinc-200 pt-7 text-[13px] text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} William Laverty · client code AGPL-3.0</p>
            <p>ATO content remains subject to ATO publication terms.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
