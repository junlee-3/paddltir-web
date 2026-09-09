import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for using Paddltir: a dragon boat crew management app for rosters, crewlists, and lineups. Independent project, not affiliated with any governing body.",
  alternates: { canonical: "/terms" },
};

const termsJsonLd = {
  "@context": "https://schema.org",
  ...breadcrumbJsonLd([{ name: "Terms of Service", path: "/terms" }]),
};

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 pb-24 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsJsonLd) }}
      />
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-normal tracking-tight1 text-zinc-900">Terms of Service</h1>
          <p className="text-sm text-zinc-500">Last updated: 9 September 2026</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">1. Acceptance</h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            By using paddltir-web.vercel.app (&quot;the Service&quot;), you agree to these Terms of
            Service. If you do not agree, do not use the Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">2. Description</h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            The Service is a dragon boat crew management application. It helps
            clubs maintain paddler rosters, build crewlists, configure boat
            lineups, and view trim and balance insights. It is an independent
            project and is not affiliated with, endorsed by, or operated by any
            dragon boat governing body or race organiser.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">3. Not coaching advice</h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            Information provided through the Service — including trim, balance,
            and lineup suggestions — is for organisational purposes only. It
            does not constitute coaching, medical, or safety advice.
          </p>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            Crew selection, race strategy, and on-water safety decisions remain
            the responsibility of your club&apos;s coaches and officials.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">4. Accounts</h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            You are responsible for maintaining the security of your account.
            Notify us immediately if you suspect unauthorised access to your
            account.
          </p>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            You must not share your account credentials with others or use the
            Service in a manner that degrades performance for other users.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            5. Acceptable Use
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1 text-[15px] leading-relaxed text-zinc-700">
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to circumvent any security measures</li>
            <li>Scrape or bulk-export other users&apos; data via the Service</li>
            <li>
              Resell access to the Service without prior written permission
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            6. Disclaimer of Warranties
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            The Service is provided &quot;as is&quot; without warranties of any kind.
            We make no guarantee that roster data, lineup calculations, or
            balance insights are complete, accurate, or suitable for your
            specific race conditions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            7. Limitation of Liability
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            To the maximum extent permitted by law, we shall not be liable for
            any indirect, incidental, or consequential damages arising from your
            use of the Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            8. Intellectual property
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            Copyright in Paddltir and this Service is owned exclusively by Jun
            Lee. All rights reserved. The source may be published publicly for
            inspection under the{" "}
            <a
              href="https://github.com/junlee-3/paddltir-web/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900"
            >
              proprietary licence
            </a>
            . That does not grant you rights to use, copy, modify, host,
            distribute, or sell the software without prior written permission.
            Buying access, a paid plan, or another licence from us is how that
            permission is granted — and only for the scope of that purchase or
            written authorisation.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            9. Governing Law
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            These Terms are governed by the laws of New South Wales, Australia.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">10. Changes</h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            We may update these Terms from time to time. Continued use of the
            Service after changes constitutes acceptance of the revised Terms.
          </p>
        </section>

        <div className="border-t border-zinc-100 pt-6 text-xs text-zinc-500">
          <Link href="/privacy" className="transition-colors hover:text-zinc-900">
            Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
