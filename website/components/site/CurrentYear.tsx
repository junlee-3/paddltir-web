"use client";

/**
 * Copyright year that survives New Year without a redeploy: the prerendered
 * HTML carries the build-time year, hydration corrects it on the client
 * (suppressHydrationWarning covers the January-before-next-deploy window).
 */
export function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
