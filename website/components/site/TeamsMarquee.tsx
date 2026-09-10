import Image from "next/image";

/**
 * Horizontal logo marquee — grayscale by default, full color on hover.
 * Two identical rows + translateX(-50%) for a seamless infinite loop.
 * Each row is repeated wide enough that one half always exceeds the viewport.
 */

const UNIQUE_TEAMS = [
  { name: "Canberra Grammar", src: "/teams/canberra-grammar.png" },
  { name: "Dragon Boat ACT", src: "/teams/dbact.png" },
] as const;

/** Repeats so one LogoRow stays wider than typical ultrawide viewports. */
const REPEAT = 10;
const TEAMS = Array.from({ length: UNIQUE_TEAMS.length * REPEAT }, (_, i) =>
  UNIQUE_TEAMS[i % UNIQUE_TEAMS.length],
);

const AVATARS = [
  { src: "/about/jun-avatar.jpg", alt: "Jun Lee" },
  { src: "/about/tom.jpg", alt: "Tom Wicks" },
] as const;

function LogoRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-14 px-7 sm:gap-20 sm:px-10"
      aria-hidden={ariaHidden || undefined}
    >
      {TEAMS.map((team, i) => (
        <li key={`${ariaHidden ? "b" : "a"}-${i}`} className="shrink-0">
          <span
            className="team-logo inline-flex h-12 items-center justify-center opacity-55 grayscale transition-[filter,opacity] duration-300 hover:opacity-100 hover:grayscale-0 sm:h-14"
            title={team.name}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={team.src}
              alt={ariaHidden ? "" : team.name}
              className="h-10 w-auto max-w-[160px] object-contain sm:h-12 sm:max-w-[180px]"
              loading="lazy"
              decoding="async"
            />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function TeamsMarquee() {
  return (
    <section className="overflow-hidden py-16 sm:py-20" aria-labelledby="teams-h">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-5 text-center sm:flex-row sm:justify-center sm:gap-3 sm:text-left">
        <div className="flex -space-x-2" aria-hidden="true">
          {AVATARS.map((a) => (
            <Image
              key={a.src}
              src={a.src}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover object-top ring-2 ring-white"
            />
          ))}
        </div>
        <h2
          id="teams-h"
          className="text-sm font-normal tracking-tight1 text-zinc-600 sm:text-[15px]"
        >
          Built by paddlers, for paddlers
        </h2>
      </div>

      <div className="relative mt-10 overflow-hidden sm:mt-12">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24"
          aria-hidden="true"
        />
        <div className="team-marquee flex w-max will-change-transform">
          <LogoRow />
          <LogoRow ariaHidden />
        </div>
      </div>
    </section>
  );
}
