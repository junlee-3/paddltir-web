import type { Metadata } from "next";
import Image from "next/image";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { personJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About: who builds it and why",
  description:
    "Paddltir is an independent project for dragon boat crew management: rosters, crewlists, boat configs, and trim insights. Who builds it and why it exists.",
  alternates: { canonical: "/about" },
};

const SITE = "https://paddltir-web.vercel.app";

const PEOPLE = [
  {
    name: "Jun Lee",
    role: "Co-founder",
    photo: "/about/jun.jpg",
    photoAlt: "Portrait of Jun Lee",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    reverse: false,
  },
  {
    name: "Tom Wicks",
    role: "Co-founder",
    photo: "/about/tom.jpg",
    photoAlt: "Portrait of Tom Wicks",
    bio: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    reverse: true,
  },
] as const;

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
    <main className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* ------------------------------------------------ hero */}
      <section className="mx-auto flex min-h-[min(72svh,640px)] max-w-5xl flex-col items-center justify-center px-5 pb-16 pt-10 text-center sm:pt-14">
        <h1
          className="reveal-lcp max-w-[18ch] text-[clamp(2.25rem,7vw,3.75rem)] font-normal leading-[1.08] tracking-tight2 text-zinc-900 sm:max-w-none sm:leading-[1.05]"
          style={{ ["--reveal-delay" as string]: "0.05s" }}
        >
          Behind every great product,
          <br />
          are great{" "}
          <span className="text-gradient-humans">humans</span>.
        </h1>
      </section>

      {/* ------------------------------------------------ people */}
      <section className="mx-auto max-w-6xl space-y-20 px-5 sm:space-y-28 sm:px-8 lg:px-10">
        {PEOPLE.map((person, i) => (
          <article
            key={person.name}
            className={`reveal-scroll grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16 ${
              person.reverse ? "md:[&>*:first-child]:order-2" : ""
            }`}
            style={{ ["--reveal-delay" as string]: `${0.04 + i * 0.04}s` }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[15px] bg-zinc-100">
              <Image
                src={person.photo}
                alt={person.photoAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
            <div className="max-w-md md:max-w-none">
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-normal leading-[1.15] tracking-tight1 text-zinc-900">
                {person.name}
              </h2>
              <p className="mt-2 text-[15px] text-zinc-500">{person.role}</p>
              <p className="mt-5 text-[15px] leading-relaxed text-zinc-700">
                {person.bio}
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
