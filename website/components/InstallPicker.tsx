"use client";

import { useState } from "react";
import { INSTALL_CLIENTS } from "@/lib/install-clients";

// Supabase-style per-client install instructions: a pill per client, a
// snippet panel with copy button, and the auth step spelled out.
export default function InstallPicker() {
  const [selectedId, setSelectedId] = useState(INSTALL_CLIENTS[0]!.id);
  const [copied, setCopied] = useState(false);

  const selected = INSTALL_CLIENTS.find((c) => c.id === selectedId) ?? INSTALL_CLIENTS[0]!;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(selected.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {INSTALL_CLIENTS.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedId(c.id);
              setCopied(false);
            }}
            className={
              c.id === selected.id
                ? "btn btn-primary px-3 py-1.5 text-[13px]"
                : "btn px-3 py-1.5 text-[13px]"
            }
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {selected.configPath && (
          <p className="text-[13px] text-zinc-500">
            Add to <code className="font-mono text-zinc-900">{selected.configPath}</code>:
          </p>
        )}
        <div className="relative">
          <pre className="code-block whitespace-pre-wrap">{selected.snippet}</pre>
          <button
            onClick={handleCopy}
            className="btn btn-fill absolute right-2 top-2 px-2.5 py-1 text-[11px]"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-[13px] leading-relaxed text-zinc-600">
          <span className="font-medium text-zinc-900">Then authenticate:</span> {selected.authNote}
        </p>
        {selected.deeplink && (
          <a href={selected.deeplink.href} className="btn inline-block px-3 py-1.5 text-[13px]">
            {selected.deeplink.label} ↗
          </a>
        )}
      </div>
    </div>
  );
}
