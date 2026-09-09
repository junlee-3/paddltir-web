import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";

export const runtime = "edge";
export const alt = "Australian Tax MCP: cited ATO retrieval for AI agents";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return ogCard({
    title: "Your AI agent, fluent in Australian tax",
    description:
      "The MCP server for Australian Taxation Office documents. Cited answers you'd otherwise pay an accountant for.",
  });
}
