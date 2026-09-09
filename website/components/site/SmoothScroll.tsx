"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Site-wide Lenis smooth scrolling, mounted once in the root layout.
 *
 * ReactLenis (root) drives window scroll through its own rAF loop, so native
 * scroll events, scroll-driven animations (animation-timeline: view()) and
 * the nav's scroll handler all keep working unchanged. `anchors` routes
 * in-page hash links through Lenis instead of the browser jump.
 *
 * Users with prefers-reduced-motion get no Lenis at all: the component
 * renders nothing and scrolling stays fully native (globals.css already
 * disables CSS smooth scrolling for them).
 */
export function SmoothScroll() {
  // Conservative default: stay native until the media query is known, so
  // reduced-motion users never see a smoothed frame.
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION);
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (reduced) return null;

  return <ReactLenis root options={{ anchors: true }} />;
}
