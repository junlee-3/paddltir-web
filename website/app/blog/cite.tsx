/** Inline citation link for post prose: vermillion-tinted so references read
 *  as citations, opening the ATO / legislation source in a new tab. */
export function Cite({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-text underline decoration-brand-200 underline-offset-2 transition-colors hover:decoration-brand"
    >
      {children}
    </a>
  );
}
