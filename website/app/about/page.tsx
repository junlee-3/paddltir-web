import type { Metadata } from "next";
import Image from "next/image";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { personJsonLd } from "@/lib/schema";
import { SITE_URL as SITE } from "@/lib/urls";

export const metadata: Metadata = {
  title: "About",
  description:
    "Paddltir is an independent project for dragon boat crew management: rosters, crewlists, boat configs, and trim insights. Who builds it and why it exists.",
  alternates: { canonical: "/about" },
};

const PEOPLE = [
  {
    name: "Jun Lee",
    role: "Co-founder",
    photo: "/about/jun-portrait-v4.jpg",
    photoAlt: "Portrait of Jun Lee",
    bio: "Jun is a dragon boat paddler and Year 12 student at Canberra Grammar School. In 2025 he competed on the Australian 18U National Dragon Boat Team as a sweep, and he has always been drawn to the messy problem of seating boats and managing crews when race day gets loud. He brings the technical side of Paddltir, with hands-on software experience that includes working as a software engineer at Silicon Valley startup NOX Devices, where he helped build products from the ground up.",
    reverse: false,
  },
  {
    name: "Tom Wicks",
    role: "Co-founder",
    photo: "/about/tom.jpg",
    photoAlt: "Portrait of Tom Wicks",
    bio: "Tom has been coaching dragon boats since 2017, working with a range of clubs guiding countless crews through national campaigns. In 2023, he was appointed Head Coach of the Australian 24U National Dragon Boat Team. Alongside his coaching career, Tom brings a strong business background to the team, holding a Bachelor of Finance from the Australian National University and years of project and program management experience at PwC and Luminact, where he led large-scale engagements across engineering, service delivery, and organisational transformation. It's this combination of on-water expertise and business acumen that sees Tom overseeing the operational and business side of the program.",
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

      {/* ------------------------------------------------ hero (Kinso-style: type only) */}
      <section className="mx-auto flex min-h-[min(58svh,520px)] max-w-5xl flex-col items-center justify-center px-5 pb-10 pt-8 text-center sm:pt-12">
        <h1
          className="reveal-lcp max-w-[18ch] text-[clamp(2.25rem,7vw,3.75rem)] font-semibold leading-[1.08] tracking-tight2 text-zinc-900 sm:max-w-none sm:leading-[1.05]"
          style={{ ["--reveal-delay" as string]: "0s" }}
        >
          Behind every great product,
          <br />
          are great{" "}
          <span className="text-gradient-humans">humans</span>.
        </h1>
      </section>

      {/* ------------------------------------------------ people */}
      <section className="mx-auto max-w-6xl space-y-20 px-5 pt-6 sm:space-y-28 sm:px-8 sm:pt-10 lg:px-10">
        {PEOPLE.map((person, i) => (
          <article
            key={person.name}
            className={`reveal-scroll grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16 ${
              person.reverse ? "md:[&>*:first-child]:order-2" : ""
            }`}
            style={{ ["--reveal-delay" as string]: `${0.04 + i * 0.04}s` }}
          >
            <div
              className={`flex ${
                person.reverse
                  ? "justify-center md:justify-end"
                  : "justify-center md:justify-start"
              }`}
            >
              {/* ~75% of the column so portraits sit smaller next to the copy */}
              <div className="relative aspect-[4/5] w-[75%] overflow-hidden rounded-[15px] bg-zinc-100">
                <Image
                  src={person.photo}
                  alt={person.photoAlt}
                  fill
                  sizes="(max-width: 768px) 75vw, 28vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            </div>
            <div className="max-w-md md:max-w-none">
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-normal leading-[1.15] tracking-tight1 text-zinc-900">
                {person.name}
              </h2>
              <p className="mt-2 text-[15px] text-zinc-500">{person.role}</p>
              <p className="mt-5 text-[15px] leading-[1.75] text-zinc-700 text-justify">
                {person.bio}
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
