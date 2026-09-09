import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { BLOG_POSTS } from "../posts";
import { DeductionsGraphic } from "../graphics";
import { blogPostingJsonLd, postMetadata } from "../seo";
import { ClosingCta } from "@/components/site/ClosingCta";

const POST = BLOG_POSTS.find((p) => p.slug === "what-can-you-actually-claim")!;

const SEO = {
  title: "Who belongs in which seat? Dragon boat seating guide",
  description:
    "How to seat a standard dragon boat crew: side preference, drummer, sweep, and the order of operations that keeps race morning calm on the pontoon.",
};

export const metadata: Metadata = postMetadata(POST, SEO);

/* ---------------------------------------------------------------------------
   /blog/what-can-you-actually-claim — seating a crew without guessing: the felt
   problem on race morning, a practical order of operations, a worked example, FAQ.
--------------------------------------------------------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "Do I have to match left and right paddlers exactly?",
    a: "Not seat-for-seat, but you want the boat roughly balanced side to side. If you have more left-handers than right-handers, spread them so neither gunwale carries the load. Paddltir shows side totals as you drag people in.",
  },
  {
    q: "Where does the drummer sit?",
    a: "Facing the crew, usually on a raised seat at the bow. They set the rate and call the race plan. Most clubs treat drummer as a fixed role for the heat, not a seat you swap mid-lineup.",
  },
  {
    q: "Can a paddler sit on their off side?",
    a: "Sometimes, for balance or when you're short on one side. Mark it in your roster so you remember — off-side paddling costs power and nobody performs their best there for a whole 500m.",
  },
  {
    q: "What if someone doesn't have a side preference?",
    a: "Seat them where the boat needs weight or headcount, then note it. After a few sessions you'll know. Until then, ask once and save the answer so the next coach doesn't start from zero.",
  },
  {
    q: "Should stronger paddlers go in the back?",
    a: "Many crews put heavier or more experienced paddlers toward the back for trim, but club boats vary. What matters is that you can see the spread — bow, middle, stern — before you load.",
  },
  {
    q: "How does Paddltir help on race morning?",
    a: "You pick the heat, drag paddlers into seats, and the layout shows side counts and weight at a glance. Same roster every regatta instead of a new guess on the pontoon.",
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
      { name: POST.title, path: "/blog/what-can-you-actually-claim" },
    ]),
  ],
};

export default function SeatingPost() {
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
              The empty boat problem
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Race morning, ten paddlers on the pontoon, call time in twenty
              minutes. Everyone knows their side — or says they do. Someone
              always turns up late. Someone else raced a different heat
              yesterday and forgot which seat they had. You start filling from
              the front because that&apos;s where the numbers are painted,
              and by seat six you realise you&apos;ve stacked four lefts on
              one side.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              The principle is simple: twenty paddlers, one drummer, one sweep,
              left and right in alternation. The practice is that people have
              preferences, injuries, and opinions. The boat doesn&apos;t care
              about any of that until it&apos;s in the water listing to
              port.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              An order that actually works
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Lock the drummer and sweep first — they&apos;re not in the
              paddling count and they anchor the ends. Then work bow to stern
              in pairs: left, right, left, right. When you&apos;re short on
              one side, swap the least painful off-side paddler rather than
              breaking the whole pattern.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Heavier paddlers toward the back is a common club habit for trim,
              but check your boat. Juniors and mixed crews play by different
              rules. What you want before anyone steps in is a layout you can
              read at a glance: who, which seat, which side.
            </p>
            <div className="tile mt-6 flex items-center justify-center p-6 sm:p-10">
              <DeductionsGraphic className="h-auto w-full max-w-[320px]" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Mei&apos;s heat, 6:40am
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              Mei coaches a community club mixed crew. Two paddlers scratched
              overnight; a reserve swapped in from the B heat. She opens
              Paddltir, pulls the saved lineup for Open Mixed 500m, drops
              the reserve into seat 8 left, and checks the side tally: 10
              left, 10 right. Weight skew is a little stern-heavy but within
              what this crew usually runs.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              On the pontoon she calls seats by number instead of waving arms.
              Load takes eight minutes. The boat sits flat at the dock. Mei is
              made up, but every club has a version of this morning — the
              difference is whether you rehearsed it on paper or in an app
              before the horn.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
              Save it for next time
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              The seating that worked today is the starting point for the
              next regatta. Write it down — or better, keep it in one place
              with side preference and weight attached to each name. Next
              race you&apos;re adjusting, not reinventing.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-700">
              If your club runs multiple heats, duplicate the layout per event
              so a scratch in the 200m doesn&apos;t scramble the 500m.{" "}
              <Link href="/app" className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900">
                Paddltir
              </Link>{" "}
              is built for that: one roster, many lineups, same pontoon calm.
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
