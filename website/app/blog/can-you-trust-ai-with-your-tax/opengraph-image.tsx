import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";
import { BLOG_POSTS } from "../posts";

const POST = BLOG_POSTS.find((p) => p.slug === "can-you-trust-ai-with-your-tax")!;

export const runtime = "edge";
export const alt = `${POST.title} · Australian Tax MCP`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return ogCard({ badge: "Blog", title: POST.title, description: POST.description });
}
