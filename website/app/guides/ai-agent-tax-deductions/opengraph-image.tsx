import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";

export const runtime = "edge";
export const alt = "How do you seat a standard boat? · Paddltir";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return ogCard({
    badge: "Guide",
    title: "How do you seat a standard boat?",
    description:
      "Left, right, drummer, sweep: a practical order of operations for filling a standard dragon boat without leaving balance to chance.",
  });
}
