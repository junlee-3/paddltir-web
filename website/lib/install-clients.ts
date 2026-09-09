// Per-client install instructions for the remote MCP endpoint.
// `snippet` is always the copyable text (shell lines, a config file, or the
// bare server URL); clients that are configured through a settings UI carry
// `steps` instead, and InstallPicker renders those as a numbered list with
// the URL alongside. Array order is tab order in the picker.

export const MCP_URL = "https://api.ato-mcp.com.au/mcp";

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

// btoa is used instead of Buffer so this module works unmodified in the
// client bundle (Next.js polyfills Buffer, but btoa is native and ASCII-safe
// for this JSON payload, so there's no need to rely on the polyfill).
const cursorConfig = btoa(JSON.stringify({ url: MCP_URL }));
const vscodeConfig = encodeURIComponent(JSON.stringify({ name: "ato", type: "http", url: MCP_URL }));

export const INSTALL_CLIENTS: InstallClient[] = [
  {
    id: "claude-ai",
    name: "Claude.ai / Claude Desktop",
    shortName: "Claude",
    group: "Web",
    snippet: MCP_URL,
    steps: [
      "Open Settings → Connectors",
      "Choose “Add custom connector”",
      "Paste the server URL and click Add",
    ],
    authNote: "Authenticate your account when Claude asks.",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    shortName: "Claude Code",
    group: "AI agent CLI",
    snippet: `claude mcp add --scope user --transport http ato ${MCP_URL}`,
    authNote: "Run **/mcp** inside Claude Code and select **ato** to authenticate your account.",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    shortName: "ChatGPT",
    group: "Web",
    snippet: MCP_URL,
    steps: [
      "Open Settings → Apps & Connectors",
      "Enable Developer Mode under Advanced",
      "Create a new connector and paste the server URL",
    ],
    authNote: "Authenticate your account when ChatGPT asks.",
  },
  {
    id: "codex",
    name: "Codex CLI",
    shortName: "Codex",
    group: "AI agent CLI",
    snippet: `codex mcp add ato --url ${MCP_URL}\ncodex mcp login ato`,
    authNote: "Authenticate your account when Codex asks.",
  },
  {
    id: "cursor",
    name: "Cursor",
    shortName: "Cursor",
    group: "IDE",
    snippet: JSON.stringify({ mcpServers: { ato: { url: MCP_URL } } }, null, 2),
    configPath: "~/.cursor/mcp.json",
    authNote: "Authenticate your account when Cursor asks.",
    deeplink: {
      label: "Add to Cursor",
      href: `cursor://anysphere.cursor-deeplink/mcp/install?name=ato&config=${cursorConfig}`,
    },
  },
  {
    id: "gemini-cli",
    name: "Gemini CLI",
    shortName: "Gemini",
    group: "AI agent CLI",
    snippet: `gemini mcp add --scope user --transport http ato ${MCP_URL}`,
    authNote: "Authenticate your account when Gemini asks.",
  },
  {
    id: "vscode",
    name: "VS Code (Copilot)",
    shortName: "VS Code",
    group: "IDE",
    snippet: `code --add-mcp '{"name":"ato","type":"http","url":"${MCP_URL}"}'`,
    authNote: "Authenticate your account when VS Code asks.",
    deeplink: { label: "Add to VS Code", href: `vscode:mcp/install?${vscodeConfig}` },
  },
  {
    id: "windsurf",
    name: "Windsurf",
    shortName: "Windsurf",
    group: "IDE",
    snippet: JSON.stringify(
      { mcpServers: { ato: { type: "streamable-http", serverUrl: MCP_URL } } },
      null,
      2,
    ),
    configPath: "~/.codeium/windsurf/mcp_config.json",
    authNote: "Authenticate your account when Windsurf asks.",
  },
  {
    id: "other",
    name: "Other / any MCP client",
    shortName: "Other",
    group: "AI agent CLI",
    snippet: JSON.stringify(
      { mcpServers: { ato: { command: "npx", args: ["-y", "ato-mcp"] } } },
      null,
      2,
    ),
    altSnippet: "npm install -g ato-mcp   # optional, npx works without installing",
    authNote: "Authenticate your account when your client asks.",
  },
];
