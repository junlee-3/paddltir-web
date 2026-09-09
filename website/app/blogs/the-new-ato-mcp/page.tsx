import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "The new ato-mcp: more data, sharper answers, setup in seconds",
  description:
    "Browser sign-in, a personal tax-facts layer, and a rebuilt corpus: 34,564 documents, 286,638 passages and measurably better search.",
  alternates: { canonical: "/blogs/the-new-ato-mcp" },
  openGraph: {
    type: "article",
    title: "The new ato-mcp: more data, sharper answers, setup in seconds",
    description:
      "Browser sign-in, a personal tax-facts layer, and a rebuilt corpus: 34,564 documents, 286,638 passages and measurably better search.",
  },
};

/* ---------------------------------------------------------------------------
   /blogs/the-new-ato-mcp — the July 2026 product update, written as a single
   marketing post in the Clinical system: white page, zinc neutrals, hairline
   borders, the vermillion accent used sparingly, decorative SVGs in the
   homepage style.
--------------------------------------------------------------------------- */

const SITE = "https://ato-mcp.com.au";

const HEADLINE_STATS = [
  { n: "34,564", label: "documents", sub: "up from ~29,900" },
  { n: "286,638", label: "searchable passages", sub: "+37% in one release" },
  { n: "64,217", label: "citation links", sub: "rulings tied to statute" },
  { n: "4,937", label: "public rulings", sub: "more than doubled" },
];

const CORPUS_ADDITIONS = [
  {
    title: "Rulings coverage more than doubled",
    sub: "From ~2,100 to 4,937 public rulings across ten series (TR, TD, GSTR, PCG and more), with withdrawn rulings clearly flagged so your agent never leans on dead guidance.",
  },
  {
    title: "The ITAA 1936 and the GST Act join the library",
    sub: "Alongside the ITAA 1997: 6,468 sections of legislation and 2,310 statutory definitions, including the GST Act's s 195-1 dictionary.",
  },
  {
    title: "Cleaner, better-connected pages",
    sub: "Every ato.gov.au guidance page re-captured with corrected structure and context, and 64,217 citation links tying rulings, guidance and legislation into one graph.",
  },
];

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      headline: "The new ato-mcp: more data, sharper answers, setup in seconds",
      description:
        "Browser sign-in, a personal tax-facts layer, and a rebuilt corpus: 34,564 documents, 286,638 passages and measurably better search.",
      datePublished: "2026-07-04",
      dateModified: "2026-07-04",
      url: `${SITE}/blogs/the-new-ato-mcp`,
      mainEntityOfPage: `${SITE}/blogs/the-new-ato-mcp`,
      image: `${SITE}/opengraph-image`,
      author: {
        "@type": "Person",
        name: "William Laverty",
        url: "https://github.com/william-laverty",
      },
      publisher: { "@id": `${SITE}/#org` },
    },
    breadcrumbJsonLd([
      { name: "Blog", path: "/blogs" },
      {
        name: "The new ato-mcp: more data, sharper answers, setup in seconds",
        path: "/blogs/the-new-ato-mcp",
      },
    ]),
  ],
};

/* ---------------------------------------------------------------------------
   Graphics — decorative SVGs in the Clinical style (hairline zinc strokes,
   soft zinc fills, one vermillion accent each), matching the homepage set.
--------------------------------------------------------------------------- */

/** Corpus growth — before/after bar pairs for documents and passages. */
function GrowthGraphic() {
  // Normalised against passages-now (286,638 = full height).
  const groups = [
    { label: "documents", before: 29861, now: 34564 },
    { label: "passages", before: 209588, now: 286638 },
  ];
  const max = 286638;
  const bw = 52;
  const gapInner = 14;
  const gapGroup = 72;
  const ox = 24;
  const baseY = 168;
  const maxH = 132;
  const width =
    ox * 2 + groups.length * (bw * 2 + gapInner) + (groups.length - 1) * gapGroup;
  return (
    <svg
      viewBox={`0 0 ${width} 200`}
      className="h-auto w-full max-w-[420px]"
      fill="none"
      aria-hidden="true"
    >
      {groups.map((g, i) => {
        const x0 = ox + i * (bw * 2 + gapInner + gapGroup);
        const hBefore = (g.before / max) * maxH;
        const hNow = (g.now / max) * maxH;
        return (
          <g key={g.label}>
            <rect
              x={x0}
              y={baseY - hBefore}
              width={bw}
              height={hBefore}
              rx="4"
              fill="#f4f4f5"
              stroke="#e4e4e7"
              strokeWidth="1"
            />
            <rect
              x={x0 + bw + gapInner}
              y={baseY - hNow}
              width={bw}
              height={hNow}
              rx="4"
              fill="#fff3ec"
              stroke="#ffd9c4"
              strokeWidth="1"
            />
            <rect
              x={x0 + bw + gapInner}
              y={baseY - hNow}
              width={bw}
              height="3"
              rx="1.5"
              fill="#fa520f"
            />
            <text
              x={x0 + bw + gapInner / 2}
              y={baseY + 22}
              textAnchor="middle"
              fontSize="11"
              fill="#a1a1aa"
              className="font-mono"
            >
              {g.label}
            </text>
          </g>
        );
      })}
      <line
        x1={ox - 6}
        y1={baseY + 0.5}
        x2={width - ox + 6}
        y2={baseY + 0.5}
        stroke="#e4e4e7"
        strokeWidth="1"
      />
    </svg>
  );
}

/** Monthly refresh — a year timeline with each build ticked, latest live. */
function FreshnessGraphic() {
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const ox = 26;
  const step = (360 - ox * 2) / (months.length - 1);
  const y = 44;
  const currentIdx = 6; // July
  return (
    <svg
      viewBox="0 0 360 90"
      className="h-auto w-full max-w-[360px]"
      fill="none"
      aria-hidden="true"
    >
      <line x1={ox} y1={y} x2={360 - ox} y2={y} stroke="#e4e4e7" strokeWidth="1" />
      {months.map((m, i) => {
        const x = ox + i * step;
        const past = i < currentIdx;
        const current = i === currentIdx;
        return (
          <g key={i}>
            {current ? (
              <>
                <circle cx={x} cy={y} r="8" fill="#fff3ec" stroke="#ffd9c4" strokeWidth="1" />
                <circle cx={x} cy={y} r="3.5" fill="#fa520f" />
              </>
            ) : (
              <circle
                cx={x}
                cy={y}
                r="3.5"
                fill={past ? "#d4d4d8" : "none"}
                stroke={past ? "none" : "#e4e4e7"}
                strokeWidth="1"
              />
            )}
            <text
              x={x}
              y={y + 28}
              textAnchor="middle"
              fontSize="10"
              fill={current ? "#fa520f" : "#a1a1aa"}
              className="font-mono"
            >
              {m}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Facts layer — a profile-card silhouette feeding chips into an answer row. */
function FactsGraphic() {
  const rows = [
    { y: 40, w: 120 },
    { y: 62, w: 96 },
    { y: 84, w: 132 },
    { y: 106, w: 84 },
  ];
  return (
    <svg
      viewBox="0 0 360 170"
      className="h-auto w-full max-w-[360px]"
      fill="none"
      aria-hidden="true"
    >
      {/* profile card */}
      <rect x="24" y="20" width="180" height="130" rx="10" fill="#ffffff" stroke="#d4d4d8" strokeWidth="1" />
      {rows.map((r) => (
        <g key={r.y}>
          <circle cx="46" cy={r.y + 4} r="3" fill="#fa520f" opacity={r.y === 62 ? 1 : 0.25} />
          <rect x="58" y={r.y} width={r.w} height="8" rx="4" fill="#f4f4f5" stroke="#e4e4e7" strokeWidth="1" />
        </g>
      ))}
      {/* flow line to the answer */}
      <path d="M204 85 C 240 85, 240 85, 268 85" stroke="#d4d4d8" strokeWidth="1.5" strokeDasharray="3 4" />
      <path d="M263 79 L 270 85 L 263 91" stroke="#d4d4d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* answer chip */}
      <rect x="276" y="70" width="62" height="30" rx="8" fill="#fff3ec" stroke="#ffd9c4" strokeWidth="1" />
      <rect x="286" y="80" width="42" height="4" rx="2" fill="#fa520f" opacity="0.5" />
      <rect x="286" y="89" width="30" height="4" rx="2" fill="#fa520f" opacity="0.3" />
    </svg>
  );
}

/** Retrieval quality — a ranked result list with the right passages surfaced. */
function RetrievalGraphic() {
  const rows = [
    { y: 30, hit: true },
    { y: 62, hit: true },
    { y: 94, hit: false },
    { y: 126, hit: false },
  ];
  return (
    <svg
      viewBox="0 0 360 170"
      className="h-auto w-full max-w-[360px]"
      fill="none"
      aria-hidden="true"
    >
      {rows.map((r, i) => (
        <g key={r.y}>
          <rect
            x="24"
            y={r.y}
            width="312"
            height="24"
            rx="8"
            fill={r.hit ? "#fff3ec" : "#f4f4f5"}
            stroke={r.hit ? "#ffd9c4" : "#e4e4e7"}
            strokeWidth="1"
          />
          {r.hit && <circle cx="40" cy={r.y + 12} r="3" fill="#fa520f" />}
          <rect
            x={r.hit ? 52 : 40}
            y={r.y + 9}
            width={150 - i * 14}
            height="6"
            rx="3"
            fill={r.hit ? "#fa520f" : "#d4d4d8"}
            opacity={r.hit ? 0.35 : 1}
          />
          <rect
            x="276"
            y={r.y + 9}
            width="44"
            height="6"
            rx="3"
            fill={r.hit ? "#fa520f" : "#e4e4e7"}
            opacity={r.hit ? 0.25 : 1}
          />
        </g>
      ))}
    </svg>
  );
}

/* --------------------------------------------------------------------------- */

function SectionHeading({
  eyebrow,
  id,
  children,
}: {
  eyebrow: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h2
        id={id}
        className="mt-3 max-w-xl text-[clamp(1.5rem,2.6vw,2rem)] font-normal leading-[1.12] tracking-tight1 text-zinc-900"
      >
        {children}
      </h2>
    </>
  );
}

export default function TheNewAtoMcpPost() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* ------------------------------------------------ post header */}
      <header className="mx-auto max-w-3xl px-5 pb-4 pt-16 text-center sm:pt-20">
        <p className="reveal" style={{ "--reveal-delay": "0s" } as React.CSSProperties}>
          <Link
            href="/blogs"
            className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-zinc-400 transition-colors duration-200 hover:text-zinc-600"
          >
            ← All posts
          </Link>
        </p>
        <p className="eyebrow reveal mt-6" style={{ "--reveal-delay": "0.04s" } as React.CSSProperties}>
          Product update · <time dateTime="2026-07-04">4 July 2026</time>
        </p>
        <h1
          className="reveal-lcp mx-auto mt-4 max-w-[22ch] text-[clamp(2rem,6vw,3.25rem)] font-normal leading-[1.06] tracking-tight2 text-zinc-900"
          style={{ "--reveal-delay": "0.08s" } as React.CSSProperties}
        >
          The new ato-mcp: more data, sharper answers, setup in seconds
        </h1>
        <p
          className="reveal mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-zinc-500 sm:text-base"
          style={{ "--reveal-delay": "0.16s" } as React.CSSProperties}
        >
          This is the biggest release since launch. Connecting now takes one
          line and a browser sign-in, your agent can carry your tax profile
          into every answer, and underneath it all sits a rebuilt corpus:
          bigger, cleaner and noticeably better at finding the passage that
          actually answers the question.
        </p>
      </header>

      {/* ------------------------------------------------ headline stats */}
      <section className="mx-auto max-w-5xl px-5 pt-10 sm:pt-12" aria-label="Release by the numbers">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {HEADLINE_STATS.map((s, i) => (
            <div
              key={s.label}
              className="card reveal p-5"
              style={{ "--reveal-delay": `${0.2 + i * 0.06}s` } as React.CSSProperties}
            >
              <p className="text-[1.6rem] tracking-tight1 text-zinc-900">{s.n}</p>
              <p className="mt-1 text-sm font-medium text-zinc-900">{s.label}</p>
              <p className="mt-1 text-xs text-zinc-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ setup */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20" aria-labelledby="setup-h">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div className="reveal-scroll">
            <SectionHeading eyebrow="Setup" id="setup-h">
              One line, a browser window, done
            </SectionHeading>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-zinc-600">
              Getting connected used to mean installing an npm package,
              generating a token on the website and pasting it into a config
              file. As of this release, tokens are gone entirely.
            </p>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-600">
              ato-mcp is now a <span className="font-medium text-zinc-900">remote MCP server</span>.
              Point your agent at one URL and a browser window opens to sign
              you in, the same OAuth flow you use everywhere else. No tokens
              to mint, nothing to paste, nothing to rotate. It works in Claude
              Code, Claude Desktop, Cursor, VS Code and any other MCP host
              that speaks the protocol. And if your host can&apos;t connect
              remotely, the npm client is still there and now signs you in the
              same way.
            </p>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-600">
              Sign in once and every device picks up where you left off.
            </p>
          </div>
          <div className="reveal-scroll space-y-3">
            <div className="card p-5">
              <p className="eyebrow">Then · three steps</p>
              <div className="code-block mt-3">
                <p className="text-zinc-400"># install, mint a token, paste it in</p>
                <p>npx -y ato-mcp</p>
                <p>ATO_MCP_TOKEN=atom_•••••••••••••</p>
              </div>
            </div>
            <div className="card p-5">
              <p className="eyebrow text-brand-text">Now · one step</p>
              <div className="code-block mt-3">
                <p>claude mcp add --scope user --transport http ato-mcp \</p>
                <p>&nbsp;&nbsp;https://api.ato-mcp.com.au/mcp</p>
                <p className="mt-2 text-zinc-400"># your browser opens: sign in, approve, done</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ auth + facts band */}
      <section className="px-3" aria-labelledby="facts-h">
        <div className="hero-card px-[clamp(24px,6vw,88px)] py-14 sm:py-16">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="reveal-scroll order-2 lg:order-1">
              <div className="tile flex min-h-[200px] items-center justify-center p-8">
                <FactsGraphic />
              </div>
            </div>
            <div className="reveal-scroll order-1 lg:order-2">
              <SectionHeading eyebrow="Personal context" id="facts-h">
                An agent that understands <em className="not-italic text-brand-text">your</em> tax position
              </SectionHeading>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-zinc-600">
                Generic tax answers are almost useless. Everything depends on
                whether you&apos;re a sole trader or a company, registered for
                GST, running a home office. The new facts layer lets you record
                about 25 of those details once, in a two-minute onboarding.
              </p>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-600">
                From then on, every tool call is answered in your context:
                deduction discovery only surfaces categories that fit how you
                work, the BAS checklist matches your registrations, and audit
                risk is scored against your actual profile.
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
                You control every field, and the privacy contract is unchanged:
                we never store your questions, your results or your documents.
                The schema has nowhere to put them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ corpus rebuild */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20" aria-labelledby="corpus-h">
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="reveal-scroll">
            <SectionHeading eyebrow="The corpus" id="corpus-h">
              Rebuilt from the ground up, and a third bigger
            </SectionHeading>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-zinc-600">
              We reworked how the knowledge base is built, end to end: how
              ATO material is captured, how documents are structured, and how
              every passage is indexed. The result is a corpus that&apos;s not
              just larger but <span className="font-medium text-zinc-900">more faithful to the source</span>:
              cleaner text, correct headings, and every passage carrying an
              understanding of where it sits in its document.
            </p>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-600">
              That last part matters more than it sounds. A paragraph about
              &ldquo;the 50% discount&rdquo; means something different in a CGT
              ruling than in a small-business concession guide, and the index
              now knows the difference.
            </p>
          </div>
          <div className="reveal-scroll">
            <div className="tile flex min-h-[220px] items-center justify-center p-8">
              <GrowthGraphic />
            </div>
            <p className="mt-3 text-center font-mono text-[0.6875rem] text-zinc-400">
              one release · documents +16% · passages +37%
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {CORPUS_ADDITIONS.map((c) => (
            <div key={c.title} className="card reveal-scroll p-5">
              <p className="text-sm font-medium leading-snug text-zinc-900">{c.title}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">{c.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ retrieval quality */}
      <section className="mx-auto max-w-5xl px-5 pb-16 sm:pb-20" aria-labelledby="search-h">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="reveal-scroll order-2 lg:order-1">
            <div className="tile flex min-h-[200px] items-center justify-center p-8">
              <RetrievalGraphic />
            </div>
          </div>
          <div className="reveal-scroll order-1 lg:order-2">
            <SectionHeading eyebrow="Search quality" id="search-h">
              Better recall, backed by evaluation, not vibes
            </SectionHeading>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-zinc-600">
              The search engine behind every answer was{" "}
              <span className="font-medium text-zinc-900">upgraded end to end</span>{" "}
              for this release and re-tuned around how people actually ask
              Australian tax questions.
            </p>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-600">
              Recall and ranking improved measurably across the evaluation
              suite: the passages your agent needs surface higher, more
              often, with fewer near-miss results. And because the suite runs
              as a regression gate, quality can only ratchet upward from here.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ freshness */}
      <section className="mx-auto max-w-3xl px-5 pb-16 text-center sm:pb-20" aria-labelledby="fresh-h">
        <div className="reveal-scroll">
          <SectionHeading eyebrow="Freshness" id="fresh-h">
            <span className="mx-auto block max-w-xl">Rebuilt monthly, served current</span>
          </SectionHeading>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-600">
            The whole corpus now refreshes on a monthly cycle: new and updated
            ATO material flows in, superseded pages are purged rather than
            left to go stale, and withdrawn rulings are flagged the moment
            their status changes. Ask the <span className="font-mono text-[0.85em]">stats</span> tool
            and your agent can tell you exactly which snapshot it&apos;s reading.
          </p>
        </div>
        <figure className="reveal-scroll mx-auto mt-8 max-w-md">
          <div className="tile flex items-center justify-center p-6">
            <FreshnessGraphic />
          </div>
          <figcaption className="mt-3 font-mono text-[0.6875rem] text-zinc-400">
            every month, a fresh snapshot
          </figcaption>
        </figure>
      </section>

      {/* ------------------------------------------------ CTA */}
      <section className="glow-cta px-5 pb-24 pt-8 sm:pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[clamp(1.5rem,5vw,2.25rem)] font-normal leading-[1.1] tracking-tight2 text-zinc-900">
            Try the new ato-mcp
          </h2>
          <p className="mt-4 text-[15px] text-zinc-500">
            One URL, a browser sign-in, and your agent is fluent in Australian
            tax, with every answer cited.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/install"
              className="btn btn-primary w-full px-7 py-3.5 text-sm sm:w-auto sm:py-3"
            >
              Get connected
            </Link>
            <Link
              href="/docs"
              className="btn btn-outline w-full px-7 py-3.5 text-sm sm:w-auto sm:py-3"
            >
              Read the docs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
