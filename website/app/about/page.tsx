import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { personJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About: who builds it and why",
  description:
    "Paddltir is an independent project for dragon boat crew management: rosters, crewlists, boat configs, and trim insights. Who builds it and why it exists.",
  alternates: { canonical: "/about" },
};

const SITE = "https://paddltir-web.vercel.app";

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      url: `${SITE}/about`,
      name: "About Paddltir",
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
            About Paddltir
          </h1>
          <p className="text-[15px] leading-relaxed text-zinc-500">
            Crew management for dragon boat clubs, built by a paddler who got
            tired of spreadsheets on race morning.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            What it is
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            Paddltir helps coaches and crew managers seat boats, maintain
            rosters, build crewlists for race weekends, and read trim and side
            balance before you leave the bank. You keep one source of truth for
            who paddles where, what they weigh, and which side they prefer.
          </p>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            It exists because race-day lineups are stressful. Names change,
            people swap sides, heats multiply, and the spreadsheet that worked
            last regatta is already out of date. Paddltir gives you a proper
            tool for the job: seat the boat, spot gaps, compare heats, and
            check balance without rebuilding everything from scratch.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            Who builds it
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            Paddltir is designed, built and run by{" "}
            <a
              href="https://github.com/junlee-3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900"
            >
              Jun Lee
            </a>
            , an Australian software developer and dragon boat paddler. It is a
            small, independent product, not a company with a sales team, and
            the site doesn&apos;t pretend otherwise: no invented testimonials,
            no made-up user counts. The{" "}
            <a
              href="https://github.com/junlee-3/paddltir-web"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900"
            >
              source code is public under the MIT License
            </a>
            , so you can check exactly what runs when you use the app.
            Copyright stays with Jun Lee; you may still use, modify, and
            distribute the software — including commercially.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            Why you can trust it
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-zinc-700">
            <li>
              Rosters, crewlists, and lineups live in one place. No more
              reconciling three versions of the same heat across WhatsApp,
              paper, and a shared sheet.
            </li>
            <li>
              Trim and side-balance numbers come from the weights you enter,
              not guesswork. You see fore-aft and left-right balance before
              you confirm a lineup.
            </li>
            <li>
              The app is open source: you can read the code, run it yourself,
              and report issues on GitHub.
            </li>
            <li>
              Privacy is straightforward. The{" "}
              <Link
                href="/privacy"
                className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900"
              >
                privacy page
              </Link>{" "}
              lists exactly what we store about paddlers and crews.
            </li>
          </ul>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            And the honest limit: Paddltir is a crew management tool, not a
            substitute for your coach&apos;s judgement. It helps you seat boats
            and spot problems; race strategy and selection calls are still
            yours.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            Independence
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            Paddltir is an independent project. It is not affiliated with,
            endorsed by, or operated by any dragon boat governing body or
            race organiser.
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
              href="https://github.com/junlee-3/paddltir-web/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900"
            >
              GitHub issues
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
