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

const SITE = "https://ato-mcp.com.au";

// Colours the browser chrome (mobile address bar) to match the white site.
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

// Google Analytics 4 (gtag.js) measurement ID.
const GA_MEASUREMENT_ID = "G-1DFRLLC2CR";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  // Site name for Google: WebSite JSON-LD name + og:site_name + applicationName
  // all say "Australian Tax MCP" (never "ato-mcp" — William, 2026-07-23).
  applicationName: "Australian Tax MCP",
  title: {
    default: "Australian Tax Knowledge for AI Agents",
    template: "%s · Australian Tax MCP",
  },
  description:
    "The MCP server that provides Australian tax knowledge to your AI agents. Cited retrieval over 34,500+ ATO documents with personal context to answer any tax question.",
  keywords: [
    "ATO MCP server",
    "Australian tax AI",
    "Model Context Protocol",
    "Claude tax tools",
    "ATO API for AI agents",
    "ITAA 1997 search",
    "Australian tax deductions AI",
    "BAS checklist AI",
    "tax RAG Australia",
  ],
  authors: [{ name: "William Laverty", url: "https://github.com/william-laverty" }],
  creator: "William Laverty",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE,
    siteName: "Australian Tax MCP",
    title: "Australian Tax MCP Server for AI Agents",
    description:
      "Cited retrieval over 34,500+ ATO documents, tax legislation and rulings with personal context to answer any tax question.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATO MCP Server for AI Agents",
    description:
      "Cited ATO docs retrieval + tax workflow tools for AI agents via MCP",
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
      name: "ato-mcp",
      alternateName: "Australian Tax MCP",
      url: SITE,
      logo: `${SITE}/logo.png`,
      description:
        "Independent Australian project providing AI agents with cited retrieval over 34,500+ ATO documents, the income tax and GST Acts and 4,900+ public rulings via the Model Context Protocol. Not affiliated with the Australian Taxation Office.",
      foundingDate: "2026-05-26",
      founder: {
        "@type": "Person",
        "@id": `${SITE}/about#william`,
        name: "William Laverty",
        url: `${SITE}/about`,
      },
      email: "privacy@ato-mcp.com.au",
      knowsAbout: [
        "Australian taxation",
        "Australian Taxation Office guidance",
        "Income Tax Assessment Act 1997",
        "GST Act",
        "Model Context Protocol",
      ],
      sameAs: [
        "https://github.com/william-laverty/ato-mcp",
        "https://www.npmjs.com/package/ato-mcp",
        "https://glama.ai/mcp/servers/william-laverty/ato-mcp",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      // Google reads the displayed site name from here (plus og:site_name).
      name: "Australian Tax MCP",
      alternateName: ["ato-mcp", "ATO MCP Server"],
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
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Australian Tax MCP blog"
          href="/feed.xml"
        />
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
