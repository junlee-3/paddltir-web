// Per-client get-started instructions for opening the Paddltir app.
// `snippet` is always the copyable text (URL or short steps); clients that
// need a walk-through carry `steps` instead, and InstallPicker renders those
// as a numbered list with the URL alongside. Array order is tab order in the
// picker.

export const MCP_URL = "https://paddltir-web.vercel.app/app";

export interface InstallClient {
  id: string;
  name: string;
  /** Short label for the picker tab; `name` is the full product name. */
  shortName: string;
  group: "AI agent CLI" | "IDE" | "Web";
  snippet: string;
  configPath?: string;
  /** UI walk-through for clients configured in settings rather than config/CLI. */
  steps?: string[];
  /** May contain **bold** segments (rendered as emphasis by InstallPicker). */
  authNote: string;
  /** Alternative snippet rendered under the main one, after an "or". */
  altSnippet?: string;
  deeplink?: { label: string; href: string };
}

export const INSTALL_CLIENTS: InstallClient[] = [
  {
    id: "claude-ai",
    name: "Claude.ai / Claude Desktop",
    shortName: "Claude",
    group: "Web",
    snippet: MCP_URL,
    steps: [
      "Open the link below in your browser",
      "Sign in with email or Google",
      "Add paddlers to your roster and seat your first boat",
    ],
    authNote: "Your account is created on **first sign-in** — no setup required.",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    shortName: "Claude Code",
    group: "AI agent CLI",
    snippet: MCP_URL,
    steps: [
      "Open the Paddltir app in your browser",
      "Sign in and add your club's paddlers",
    ],
    authNote: "Use any browser on the same machine — Paddltir runs in the tab.",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    shortName: "ChatGPT",
    group: "Web",
    snippet: MCP_URL,
    steps: [
      "Open the link below in your browser",
      "Sign in with email or Google",
      "Build a crewlist and seat your first heat",
    ],
    authNote: "Your account is created on **first sign-in** — no setup required.",
  },
  {
    id: "codex",
    name: "Codex CLI",
    shortName: "Codex",
    group: "AI agent CLI",
    snippet: MCP_URL,
    steps: [
      "Open the Paddltir app in your browser",
      "Sign in and start with your roster",
    ],
    authNote: "Paddltir is a web app — open the URL in any browser to get started.",
  },
  {
    id: "cursor",
    name: "Cursor",
    shortName: "Cursor",
    group: "IDE",
    snippet: MCP_URL,
    steps: [
      "Open the link below in your browser",
      "Sign in with email or Google",
      "Keep the tab open on race day for quick lineup changes",
    ],
    authNote: "Bookmark the app URL so you can open Paddltir from any device.",
  },
  {
    id: "gemini-cli",
    name: "Gemini CLI",
    shortName: "Gemini",
    group: "AI agent CLI",
    snippet: MCP_URL,
    steps: [
      "Open the Paddltir app in your browser",
      "Sign in and add your paddlers",
    ],
    authNote: "Paddltir is a web app — open the URL in any browser to get started.",
  },
  {
    id: "vscode",
    name: "VS Code (Copilot)",
    shortName: "VS Code",
    group: "IDE",
    snippet: MCP_URL,
    steps: [
      "Open the link below in your browser",
      "Sign in with email or Google",
      "Seat your first boat from the roster",
    ],
    authNote: "Bookmark the app URL for quick access on race day.",
  },
  {
    id: "windsurf",
    name: "Windsurf",
    shortName: "Windsurf",
    group: "IDE",
    snippet: MCP_URL,
    steps: [
      "Open the link below in your browser",
      "Sign in with email or Google",
      "Create a crewlist for your next regatta",
    ],
    authNote: "Bookmark the app URL so you can open Paddltir from any device.",
  },
  {
    id: "other",
    name: "Other / any browser",
    shortName: "Other",
    group: "AI agent CLI",
    snippet: MCP_URL,
    altSnippet: "https://paddltir-web.vercel.app  # marketing site",
    authNote: "Open the app URL, sign in, and start with your roster — works on desktop and mobile.",
  },
];
