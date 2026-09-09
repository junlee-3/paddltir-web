import Link from "next/link";

/**
 * Slim home-page announcement bar (heynox pattern): a 52px white strip that
 * sits above the hero card and links to the latest product update. Hidden
 * below lg. The fixed Nav queries the `.announcement` class to know when to
 * offset below it.
 */
export function AnnouncementBanner() {
  return (
    <Link
      href="/blogs/the-new-ato-mcp"
      className="announcement group flex h-[52px] items-center justify-center gap-2.5 bg-white text-[14px] leading-normal max-lg:hidden"
      aria-label="We've improved the MCP. See what's new."
    >
      <svg
        width={18}
        height={18}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100"
      >
        <rect x="1" y="1" width="30" height="30" rx="8.5" fill="#fa520f" />
        <circle cx="10.5" cy="16" r="2.6" fill="#ffffff" />
        <rect x="15" y="13.9" width="7.5" height="4.2" rx="2.1" fill="#ffffff" />
      </svg>
      <span className="tracking-[-0.1px] text-zinc-500">
        <span className="font-medium text-zinc-900">We&apos;ve improved the MCP.</span>
        <span className="ml-2 text-zinc-400 transition-colors duration-200 group-hover:text-zinc-600">
          See what&apos;s new
        </span>
      </span>
      <svg
        width={14}
        height={14}
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className="-ml-1 mt-px shrink-0 text-zinc-400 transition-transform duration-200 group-hover:translate-x-[2px]"
      >
        <path
          d="M5.25 3.5L8.75 7L5.25 10.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
