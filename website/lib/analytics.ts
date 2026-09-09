import { track } from "@vercel/analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fire a product event to both Vercel Analytics and GA4. Client-side only.
 * Both transports use beacons, so events fired just before a navigation
 * (e.g. the OAuth consent redirect) still deliver.
 *
 * Funnel events in use: connect_cta_clicked, install_command_copied,
 * consent_sign_in_started, consent_approved, consent_denied. Mark
 * consent_approved as a key event in GA4 admin.
 */
export function trackEvent(
  name: string,
  data?: Record<string, string | number | boolean>,
) {
  try {
    track(name, data);
  } catch {
    // Analytics must never break the UI.
  }
  try {
    window.gtag?.("event", name, data);
  } catch {
    // Same.
  }
}
