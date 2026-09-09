"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { INSTALL_CLIENTS, MCP_URL } from "@/lib/install-clients";
import { AGENT_ICONS } from "@/components/AgentIcons";
import { trackEvent } from "@/lib/analytics";

/* ---------------------------------------------------------------------------
   Install picker — a self-contained card: a scrollable tab rail of clients
   (brand mark + name, active = soft pill), then the install laid out as the
   two real steps (add the server → sign in). Used on /install and
   /onboard/install.
--------------------------------------------------------------------------- */

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className={className}>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.8" />
      <path d="M10.5 3.5v-.2A1.8 1.8 0 0 0 8.7 1.5H4.3a1.8 1.8 0 0 0-1.8 1.8v4.4a1.8 1.8 0 0 0 1.8 1.8h.2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={className}>
      <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyButton({ text, client }: { text: string; client: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return; // clipboard unavailable (permissions/insecure context) — leave the button as-is
    }
    trackEvent("install_command_copied", { client });
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy to clipboard"
      className="btn btn-fill absolute right-2 top-2 gap-1.5 border border-zinc-200/60 px-2.5 py-1 text-[11px]"
    >
      {copied ? <CheckIcon className="h-3 w-3" /> : <CopyIcon className="h-3 w-3" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

/** Renders a note string, emphasising any **bold** segments. */
function NoteText({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-medium text-zinc-900">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Code block with the copy affordance in its top-right corner. */
function Snippet({ text, client }: { text: string; client: string }) {
  return (
    <div className="relative">
      <pre className="code-block whitespace-pre-wrap pr-20">{text}</pre>
      <CopyButton text={text} client={client} />
    </div>
  );
}

export default function InstallPicker() {
  const [selectedId, setSelectedId] = useState(INSTALL_CLIENTS[0]!.id);
  const railRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ left: false, right: false });

  const selected = INSTALL_CLIENTS.find((c) => c.id === selectedId) ?? INSTALL_CLIENTS[0]!;

  // Edge fades only where the rail actually continues, so the cut-off tab
  // reads as "scroll for more" without permanently dimming the ends.
  const updateFades = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setFade({ left: rail.scrollLeft > 4, right: rail.scrollLeft < max - 4 });
  }, []);

  useEffect(() => {
    updateFades();
    window.addEventListener("resize", updateFades);
    return () => window.removeEventListener("resize", updateFades);
  }, [updateFades]);

  const select = (id: string, focus = false) => {
    setSelectedId(id);
    const tab = railRef.current?.querySelector<HTMLButtonElement>(`#client-tab-${id}`);
    if (focus) tab?.focus();
    tab?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = INSTALL_CLIENTS.findIndex((c) => c.id === selected.id);
    const last = INSTALL_CLIENTS.length - 1;
    let next = -1;
    if (e.key === "ArrowRight") next = idx === last ? 0 : idx + 1;
    else if (e.key === "ArrowLeft") next = idx === 0 ? last : idx - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next < 0) return;
    e.preventDefault();
    select(INSTALL_CLIENTS[next]!.id, true);
  };

  const isConfig = selected.snippet.trimStart().startsWith("{");
  const stepOneTitle = selected.steps
    ? "Add the connector"
    : isConfig
      ? "Add the server config"
      : "Run this command";

  return (
    <div className="card overflow-hidden">
      {/* --- Client rail ---------------------------------------------------- */}
      <div className="relative border-b border-zinc-100">
        <div
          ref={railRef}
          role="tablist"
          aria-label="MCP clients"
          onScroll={updateFades}
          className="flex gap-1 overflow-x-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {INSTALL_CLIENTS.map((c) => {
            const Icon = AGENT_ICONS[c.id]!;
            const active = c.id === selected.id;
            return (
              <button
                key={c.id}
                id={`client-tab-${c.id}`}
                role="tab"
                aria-selected={active}
                aria-controls="client-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => select(c.id)}
                onKeyDown={onKeyDown}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] transition-colors duration-200 ${
                  active ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 transition-colors duration-200 ${active ? "text-zinc-900" : "text-zinc-400"}`} />
                {c.shortName}
              </button>
            );
          })}
        </div>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent transition-opacity duration-200 ${fade.left ? "opacity-100" : "opacity-0"}`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent transition-opacity duration-200 ${fade.right ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      {/* --- Instructions: the two real steps ------------------------------- */}
      <div
        id="client-panel"
        role="tabpanel"
        aria-labelledby={`client-tab-${selected.id}`}
        className="grid grid-cols-[2rem_1fr] gap-x-3 p-5 sm:gap-x-4 sm:p-6"
      >
        <div className="flex flex-col items-center">
          <span className="pt-0.5 font-mono text-[0.6875rem] text-zinc-500">01</span>
          <span className="mt-2 w-px flex-1 bg-zinc-100" aria-hidden="true" />
        </div>
        <div className="min-w-0 pb-7">
          <p className="text-[13px] font-medium text-zinc-900">
            {stepOneTitle}
            {selected.configPath && (
              <>
                {" "}
                <span className="font-normal text-zinc-500">
                  in <code className="font-mono text-[12px] text-zinc-700">{selected.configPath}</code>
                </span>
              </>
            )}
          </p>

          {selected.steps ? (
            <>
              <ol className="mt-3 space-y-2">
                {selected.steps.map((step, i) => (
                  <li key={step} className="flex gap-2.5 text-sm leading-relaxed text-zinc-600">
                    <span className="select-none font-mono text-[0.6875rem] leading-[1.65rem] text-zinc-300">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <div className="mt-3">
                <Snippet text={MCP_URL} client={selected.id} />
              </div>
            </>
          ) : (
            <div className="mt-3">
              <Snippet text={selected.snippet} client={selected.id} />
            </div>
          )}

          {selected.altSnippet && (
            <>
              <p className="mt-3 text-[13px] text-zinc-500">or</p>
              <div className="mt-2">
                <Snippet text={selected.altSnippet} client={selected.id} />
              </div>
            </>
          )}

          {selected.deeplink && (
            <p className="mt-3 flex items-center gap-2.5 text-[13px] text-zinc-500">
              or
              <a href={selected.deeplink.href} className="btn btn-outline gap-1.5 px-3 py-1.5 text-[13px] text-zinc-900">
                {selected.deeplink.label}
                <span aria-hidden="true" className="text-zinc-400">
                  ↗
                </span>
              </a>
            </p>
          )}
        </div>

        <div className="flex flex-col items-center">
          <span className="pt-0.5 font-mono text-[0.6875rem] text-zinc-500">02</span>
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-zinc-900">Log in with your browser</p>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
            <NoteText text={selected.authNote} />
          </p>
        </div>
      </div>
    </div>
  );
}
