import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { BLOG_POSTS } from "../posts";
import { AbnGraphic } from "../graphics";
import { blogPostingJsonLd, postMetadata } from "../seo";
import { ClosingCta } from "@/components/site/ClosingCta";

const POST = BLOG_POSTS.find((p) => p.slug === "nobody-withholds-your-tax-anymore")!;

const SEO = {
  title: "Keep dragon boat race lineup history",
  description:
    "After the final, the lineup fades. How to record who raced which heat so the next regatta starts from history — not a blank sheet and group-chat archaeology.",
};

export const metadata: Metadata = postMetadata(POST, SEO);

/* ---------------------------------------------------------------------------
   /blog/nobody-withholds-your-tax-anymore — lineup memory: why it fades, what to
   record, a post-regatta habit, FAQ.
--------------------------------------------------------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "What should we save after each regatta?",
    a: "Final lineup per heat: names, seats, side, drummer, sweep. Note scratches and reserves who raced. That's enough to seat the next meet faster.",
  },
  {
    q: "How long do we keep old lineups?",
    a: "At least a season. Patterns emerge — who races Open vs Mixed, who sweeps, who can't make early heats — and new coaches inherit context.",
  },
  {
    q: "New coach — how do they learn the crew?",
    a: "Roster plus past lineups beats oral history. Side preference and weight on the profile; heat history shows who actually raced, not who said they'd come.",
  },
  {
    q: "Should paddlers see historical lineups?",
    a: "Helpful for transparency — less 'why am I always seat 10?' if they can see the pattern. Read-only access is enough.",
  },
  {
    q: "We only remember winners",
    a: "Fair. But seating the next 500m doesn't need trophies — it needs who sat where when the boat felt good.",
  },
  {
    q: "Does Paddltir keep history automatically?",
    a: "Saved lineups stay tied to the roster. Duplicate last regatta's heat, swap the scratches, adjust — you're editing, not rebuilding.",
  },
];

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    blogPostingJsonLd(POST),
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    breadcrumbJsonLd([
      { name: "Blog", path: "/blog" },
      { name: POST.title, path: "/blog/nobody-withholds-your-tax-anymore" },
    ]),
  ],
};

export default function LineupHistoryPost() {
  return (
    <>
    <main className="mx-auto min-h-screen max-w-5xl px-5 pb-24 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <div className="mx-auto max-w-3xl">

        {/* ----------------------------------------------- header */}
        <Link
          href="/blog"
          className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-zinc-500 transition-colors hover:text-zinc-600"
        >
          ← All posts
        </Link>
        <div className="mt-6 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <p className="eyebrow">{POST.tag}</p>
          <span className="font-mono text-[0.6875rem] text-zinc-300" aria-hidden="true">·</span>
          <p className="font-mono text-[0.6875rem] text-zinc-500">
            <time dateTime={POST.date}>{POST.dateLabel}</time>
          </p>
          <span className="font-mono text-[0.6875rem] text-zinc-300" aria-hidden="true">·</span>
          <p className="font-mono text-[0.6875rem] text-zinc-500">{POST.readingTime}</p>
        </div>
        <h1
          className="reveal-lcp mt-3 text-[clamp(2rem,4vw,2.75rem)] font-normal leading-[1.08] tracking-tight2 text-zinc-900"
          style={{ "--reveal-delay": "0s" } as React.CSSProperties}
        >
          {POST.title}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-zinc-500">
          {POST.description}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          <span className="font-medium text-zinc-700">In short:</span>{" "}
          {SEO.description}
        </p>

        {/* ----------------------------------------------- story */}
        <div className="mt-12 space-y-12">
          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              The fog after the final
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Regatta done, tent packed, photos in the group chat. Ask who
              sat seat 4 in the Mixed heat and you get three different names
              by Tuesday. The lineup existed for one morning — then it
              dissolved into memory and half-deleted messages.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              That&apos;s normal. Nobody&apos;s job is to be the club&apos;s
              living archive. But next month someone will seat Open from
              scratch and repeat the same experiments you already ran.
            </p>
            <div className="tile mt-6 flex items-center justify-center p-6 sm:p-10">
              <AbnGraphic className="h-auto w-full max-w-[320px]" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Three things worth keeping
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              First, the final seat map per heat — not the draft from
              Thursday, the one that actually raced. Second, who scratched
              and who came off the bench; that tells you depth. Third, anything
              you noticed on the water: stern heavy, bow light, one side
              strong. A sentence in the notes field beats a perfect lineup
              you can't explain.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Store it where the next coach will look — not a personal
              camera roll, not a thread that scrolls away. Same place as the
              roster, attached to the same names.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Jess takes over in March
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Jess inherits the committee role mid-season. Last year&apos;s
              coach moved interstate. She opens Paddltir, finds last
              regatta&apos;s Open 500m lineup, duplicates it, swaps two
              paddlers who left and a reserve who&apos;s now core crew. Side
              and weight totals carry over. First session seated in ten
              minutes instead of re-interviewing twenty people about left or
              right.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Jess is made up. The handover problem is not — clubs lose
              knowledge every time a volunteer rotates off.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Start the habit before the next meet
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              After your next race, save the final lineup before the tent
              comes down. One minute. Do it twice and it&apos;s routine.
              Future-you — or future coach — gets a head start instead of a
              blank grid and a vague memory of &quot;I think we ran Sam in
              the middle.&quot;
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              If your lineups live in messages and muscle memory,{" "}
              <Link href="/app" className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900">
                Paddltir
              </Link>{" "}
              keeps them with the roster. Same crew, less re-learning every
              season.
            </p>
          </section>
        </div>

        {/* ----------------------------------------------- FAQ */}
        <section className="mt-16" aria-labelledby="faq-h">
          <h2 id="faq-h" className="text-lg font-medium tracking-tight1 text-zinc-900">
            The questions everyone asks eventually
          </h2>
          <div className="mt-4">
            {FAQS.map((f) => (
              <details key={f.q} className="group border-b border-zinc-100 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium marker:hidden">
                  <h3 className="text-[15px] font-medium">{f.q}</h3>
                  <span
                    className="text-lg font-normal text-zinc-400 transition-transform duration-300 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
    <ClosingCta />
    </>
  );
}
