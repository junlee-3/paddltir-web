import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";

export const runtime = "edge";
export const alt = "Paddltir — dragon boat crew management";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return ogCard({
    title: "Build crews that win when it counts",
    description:
      "Configure, manage, and get real insights into your dragon boat crew.",
  });
}
