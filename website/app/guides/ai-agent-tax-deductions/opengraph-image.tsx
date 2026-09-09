import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";

export const runtime = "edge";
export const alt = "Can AI find your tax deductions? · Australian Tax MCP";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return ogCard({
    badge: "Guide",
    title: "Can AI find your tax deductions?",
    description:
      "What a connected agent can do for a sole trader in 2025-26: cited deduction categories, records to keep, and the honest limits.",
  });
}
