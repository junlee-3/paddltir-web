import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Nav } from "../components/site/Nav";
import { Footer } from "../components/site/Footer";
import { SmoothScroll } from "../components/site/SmoothScroll";
import "./globals.css";

// Switzer is self-hosted (Fontshare / ITF Free Font License — see app/fonts/FFL.txt).
const sans = localFont({
  src: [
    { path: "./fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Switzer-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// Serif italic accent — single style, used for one emphasised word in display
// copy (the hero's "fluent"). Switzer has no true italic; this is the accent.
const serifAccent = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif-accent",
  display: "swap",
});

const SITE = "https://paddltir-web.vercel.app";

// Colours the browser chrome (mobile address bar) to match the white site.
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

// Google Analytics 4 (gtag.js) measurement ID.
const GA_MEASUREMENT_ID = "G-1DFRLLC2CR";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  applicationName: "Paddltir",
  title: {
    default: "Paddltir — Dragon boat crew management",
    template: "%s · Paddltir",
  },
  description:
    "Configure crews, manage rosters and crewlists, and get real insights into trim, balance and lineups before race day.",
  keywords: [
    "dragon boat",
    "crew management",
    "boat lineup",
    "paddler roster",
    "crewlist",
    "boat trim",
    "dragon boat coaching",
    "race day seating",
    "Paddltir",
  ],
  authors: [{ name: "Jun Lee", url: "https://github.com/junlee-3" }],
  creator: "Jun Lee",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE,
    siteName: "Paddltir",
    title: "Paddltir — Dragon boat crew management",
    description:
      "Configure crews, manage rosters and crewlists, and get real insights into trim, balance and lineups before race day.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paddltir — Dragon boat crew management",
    description:
      "Configure, manage, and get real insights into your crew before race day.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    other: { "msvalidate.01": "7EB4525032DD3F5DCBDE5EC95AC583FE" },
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "Paddltir",
      alternateName: "Paddltir",
      url: SITE,
      logo: `${SITE}/logo.png`,
      description:
        "Dragon boat crew management for coaches and clubs: rosters, crewlists, boat configs, and trim insights before race day.",
      foundingDate: "2026-05-26",
      founder: {
        "@type": "Person",
        "@id": `${SITE}/about#jun`,
        name: "Jun Lee",
        url: `${SITE}/about`,
      },
      knowsAbout: [
        "Dragon boat racing",
        "Crew management",
        "Boat configuration",
        "Sports analytics",
        "Paddler rosters",
      ],
      sameAs: [
        "https://github.com/junlee-3/paddltir-web",
        "https://github.com/junlee-3",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "Paddltir",
      alternateName: ["Paddltir crew management"],
      publisher: { "@id": `${SITE}/#org` },
      inLanguage: "en-AU",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={`${sans.variable} ${mono.variable} ${serifAccent.variable}`}>
      <body className="min-h-screen bg-white font-sans text-zinc-900 antialiased">
        {/* Google tag (gtag.js). lazyOnload, not afterInteractive: the
            afterInteractive strategy makes Next preload the 190 KB gtag.js in
            <head>, where it competes with first paint on throttled mobile
            connections (Lighthouse mobile ~73 with the preload, ~96 without).
            Deferring to browser idle costs nothing measurable in GA data —
            page_view still fires on every load — and takes the script out of
            the critical path entirely. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/* Rendered here (React hoists it to <head>) rather than via
            metadata.alternates.types, which page-level `alternates` exports
            would shallow-merge away. */}
        <link rel="alternate" type="text/plain" href="/llms.txt" />
        {/* Warm the connection gtag.js will use once it loads at idle. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {/* Skip link: first tab stop, visually hidden until focused. */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-zinc-900 focus:px-5 focus:py-2.5 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        <div id="content" className="pt-16">{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
