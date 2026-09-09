import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Paddltir handles your data: what paddler and crew fields we store, what we never store, and how to delete your account.",
  alternates: { canonical: "/privacy" },
};

const privacyJsonLd = {
  "@context": "https://schema.org",
  ...breadcrumbJsonLd([{ name: "Privacy Policy", path: "/privacy" }]),
};

const storedFields: { field: string; description: string }[] = [
  { field: "email", description: "Your email address, used for sign-in and account recovery" },
  { field: "given_name", description: "Your first name" },
  { field: "family_name", description: "Your last name" },
  { field: "display_name", description: "How your name appears in the app" },
  { field: "weight_kg", description: "Your weight in kilograms, used for trim and balance calculations" },
  { field: "preferred_side", description: "Your preferred paddling side (left, right, or either)" },
  { field: "role", description: "Your role in the crew (paddler, drummer, or sweep)" },
  { field: "club_id", description: "The club you belong to" },
  { field: "availability", description: "Whether you are available for upcoming race weekends" },
  { field: "notes", description: "Optional notes your coach may add (e.g. injury, swap preference)" },
  { field: "created_at", description: "When your account or profile was created" },
  { field: "updated_at", description: "When your profile was last updated" },
];

const eventTypes = [
  "Email sign-in (one-time code)",
  "Roster or crewlist created or updated",
  "Lineup saved or modified",
  "Account deleted",
];

const notStored = [
  "Payment or billing information",
  "Location or GPS data",
  "Health or medical records beyond optional coach notes",
  "Data from third-party services",
  "Your conversations or queries to any AI features",
];

const linkCls =
  "text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900";

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 pb-24 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyJsonLd) }}
      />
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-normal tracking-tight1 text-zinc-900">Privacy Policy</h1>
          <p className="text-sm text-zinc-500">Last updated: 26 May 2026</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">1. Overview</h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            paddltir-web.vercel.app (&quot;we&quot;, &quot;our&quot;, &quot;the service&quot;) is a dragon boat
            crew management app. We collect the minimum information needed to
            maintain rosters, crewlists, and lineups for your club.
          </p>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            We are not affiliated with any dragon boat governing body. This
            service operates under Australian privacy law principles.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            2. Information we collect
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            When you create an account, we collect your email address. Coaches
            and crew managers may also enter the following paddler profile
            fields. Most fields are{" "}
            <span className="font-medium">optional</span>: you can use the
            service with only an email address.
          </p>

          <div className="card overflow-hidden p-0">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="eyebrow px-4 py-2.5 text-left">
                    Field
                  </th>
                  <th className="eyebrow px-4 py-2.5 text-left">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {storedFields.map((row, idx) => (
                  <tr
                    key={row.field}
                    data-field={row.field}
                    className={idx % 2 === 1 ? "bg-zinc-50/70" : "bg-white"}
                  >
                    <td className="px-4 py-2 font-mono text-xs text-zinc-900">
                      {row.field}
                    </td>
                    <td className="px-4 py-2 text-[13px] text-zinc-500">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            3. What we do not store
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-zinc-700">
            {notStored.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            4. Event types logged
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            We log the following events for security and debugging purposes.
            Logs are retained for 90 days.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-zinc-700">
            {eventTypes.map((event) => (
              <li key={event}>{event}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">
            5. Data retention &amp; deletion
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            You can delete your account at any time from your{" "}
            <Link href="/account" className={linkCls}>
              account page
            </Link>
            . Deletion is permanent and cascades to all associated records
            including your paddler profile and any lineups you created.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight1 text-zinc-900">6. Contact</h2>
          <p className="text-[15px] leading-relaxed text-zinc-700">
            For privacy enquiries, open an issue at{" "}
            <a
              href="https://github.com/junlee-3/paddltir-web/issues"
              target="_blank"
              rel="noopener noreferrer"
              className={linkCls}
            >
              github.com/junlee-3/paddltir-web/issues
            </a>
            .
          </p>
        </section>

        <div className="border-t border-zinc-100 pt-6 text-xs text-zinc-500">
          <Link href="/terms" className="transition-colors hover:text-zinc-900">
            Terms of Service
          </Link>
        </div>
      </div>
    </main>
  );
}
