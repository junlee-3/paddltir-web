import type { Metadata } from "next";
import InstallPicker from "@/components/InstallPicker";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { MCP_URL } from "@/lib/install-clients";

export const metadata: Metadata = {
  title: "Get started: open the app",
  description:
    "Open Paddltir in your browser to manage rosters, build crewlists, and seat boats. Sign in with email or Google — no setup required.",
  alternates: { canonical: "/install" },
};

const installJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "Get started with Paddltir",
      description:
        "Open the Paddltir app, sign in, and start managing your club's rosters and lineups.",
      totalTime: "PT2M",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Open the app",
          text: `Go to ${MCP_URL} in your browser, or click Open App from any page on this site.`,
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Sign in",
          text: "Authenticate with email or Google. Your account is created on first sign-in.",
        },
      ],
    },
    breadcrumbJsonLd([{ name: "Get started", path: "/install" }]),
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
        Get your crew race-day ready.
      </h1>

      <div className="reveal mt-10 sm:mt-12" style={{ "--reveal-delay": "0.24s" } as React.CSSProperties}>
        <InstallPicker />
      </div>
    </main>
  );
}
