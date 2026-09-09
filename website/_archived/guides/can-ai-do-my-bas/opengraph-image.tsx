import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";

export const runtime = "edge";
export const alt = "How do you run multiple heats? · Paddltir";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return ogCard({
    badge: "Guide",
    title: "How do you run multiple heats?",
    description:
      "Open, mixed, women's — keep separate lineups for each heat so one change doesn't wipe the next race.",
  });
}
