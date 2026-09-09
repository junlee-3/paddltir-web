import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";

export const runtime = "edge";
export const alt = "Can AI do your BAS? · Australian Tax MCP";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return ogCard({
    badge: "Guide",
    title: "Can AI do your BAS?",
    description:
      "What an agent prepares and what you still lodge: the labels that apply, the evidence to gather, and the due dates, all cited.",
  });
}
