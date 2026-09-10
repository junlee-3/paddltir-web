/**
 * Canonical production origins.
 * Override via Vercel env for previews if needed.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://paddltir.com";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://app.paddltir.com";

/** @deprecated Use SITE_URL — kept as alias during migration */
export const SITE = SITE_URL;
