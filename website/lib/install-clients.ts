// Per-client install instructions for the remote MCP endpoint.
// InstallPicker renders `snippet` verbatim (shell lines, a config file, or
// numbered prose, depending on the client) — it doesn't branch on any
// metadata here.

export const MCP_URL = "https://api.ato-mcp.com.au/mcp";

export interface InstallClient {
  id: string;
  name: string;
  group: "AI agent CLI" | "IDE" | "Web";
  snippet: string;
  configPath?: string;
  authNote: string;
  deeplink?: { label: string; href: string };
}

// btoa is used instead of Buffer so this module works unmodified in the
// client bundle (Next.js polyfills Buffer, but btoa is native and ASCII-safe
// for this JSON payload, so there's no need to rely on the polyfill).
const cursorConfig = btoa(JSON.stringify({ url: MCP_URL }));
const vscodeConfig = encodeURIComponent(JSON.stringify({ name: "ato", type: "http", url: MCP_URL }));

export const INSTALL_CLIENTS: InstallClient[] = [
  {
    id: "claude-code",
    name: "Claude Code",
    group: "AI agent CLI",
    snippet: `claude mcp add --scope user --transport http ato ${MCP_URL}`,
    authNote: "Then run /mcp inside Claude Code, select “ato”, and choose Authenticate — your browser opens to sign in.",
  },
  {
    id: "codex",
    name: "Codex CLI",
    group: "AI agent CLI",
    snippet: `codex mcp add ato --url ${MCP_URL}\ncodex mcp login ato`,
    authNote: "codex mcp login opens your browser to sign in.",
  },
  {
    id: "gemini-cli",
    name: "Gemini CLI",
    group: "AI agent CLI",
    snippet: `gemini mcp add --scope user --transport http ato ${MCP_URL}`,
    authNote: "Gemini CLI detects the auth challenge on first use and opens your browser automatically.",
  },
  {
    id: "vscode",
    name: "VS Code (Copilot)",
    group: "IDE",
    snippet: `code --add-mcp '{"name":"ato","type":"http","url":"${MCP_URL}"}'`,
    authNote: "VS Code prompts to authenticate in your browser when the server first connects.",
    deeplink: { label: "Add to VS Code", href: `vscode:mcp/install?${vscodeConfig}` },
  },
  {
    id: "cursor",
    name: "Cursor",
    group: "IDE",
    snippet: JSON.stringify({ mcpServers: { ato: { url: MCP_URL } } }, null, 2),
    configPath: "~/.cursor/mcp.json",
    authNote: "Cursor shows a “Needs login” prompt on the server — click it to sign in via your browser.",
    deeplink: {
      label: "Add to Cursor",
      href: `cursor://anysphere.cursor-deeplink/mcp/install?name=ato&config=${cursorConfig}`,
    },
  },
  {
    id: "windsurf",
    name: "Windsurf",
    group: "IDE",
    snippet: JSON.stringify(
      { mcpServers: { ato: { type: "streamable-http", serverUrl: MCP_URL } } },
      null,
      2,
    ),
    configPath: "~/.codeium/windsurf/mcp_config.json",
    authNote:
      "If Windsurf doesn't open a sign-in window, use the npm fallback below (Other / any MCP client).",
  },
  {
    id: "claude-ai",
    name: "Claude.ai / Claude Desktop",
    group: "Web",
    snippet: `1. Open Settings → Connectors\n2. Add custom connector\n3. Paste ${MCP_URL}\n4. Click Connect and sign in when the browser window appears`,
    authNote: "Available on paid Claude plans; the browser sign-in appears when you connect.",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    group: "Web",
    snippet: `1. Settings → Apps & Connectors → enable Developer Mode\n2. New connector → paste ${MCP_URL}\n3. Choose OAuth and sign in when prompted`,
    authNote: "Requires a plan with connector support; Developer Mode must be enabled.",
  },
  {
    id: "other",
    name: "Other / any MCP client",
    group: "AI agent CLI",
    snippet: JSON.stringify(
      { mcpServers: { ato: { command: "npx", args: ["-y", "ato-mcp"] } } },
      null,
      2,
    ),
    authNote:
      "The ato-mcp npm package proxies the hosted server for stdio-only clients (OpenCode, Zed, …) — first run opens your browser to sign in. Also installable globally: npm install -g ato-mcp.",
  },
];
