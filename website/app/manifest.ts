import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Australian Tax MCP",
    short_name: "ato-mcp",
    description:
      "The MCP server that provides Australian tax knowledge to your AI agents. Cited retrieval over 34,500+ ATO documents with personal context to answer any tax question.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
