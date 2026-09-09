/**
 * The page signature: a faint vermillion "traceable answer" thread.
 * Rendered inside relatively-positioned sections to imply one continuous
 * rail connecting hero → demo → corpus → CTA. Static (reduced-motion safe);
 * its job is visual continuity, not animation.
 */
export function AccentThread({ className = "" }: { className?: string }) {
  return <span className={`accent-thread ${className}`} aria-hidden="true" />;
}
