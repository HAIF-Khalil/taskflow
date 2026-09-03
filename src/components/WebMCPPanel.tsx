"use client";

import { useActivity } from "@/hooks/use-activity";
import { formatClock, summarizeResult } from "@/lib/format";
import { marketplaceToolNames } from "@/lib/webmcp/register-tools";
import { cn } from "@/lib/utils";

export function WebMCPPanel() {
  const { tools } = useActivity();
  const registered = marketplaceToolNames();

  return (
    <section className="flex h-full min-h-72 flex-col overflow-hidden rounded-2xl border border-emerald-400/15 bg-[#0b1210]">
      <header className="border-b border-emerald-400/10 px-4 py-3">
        <p className="text-[11px] font-medium tracking-[0.16em] text-emerald-300/80 uppercase">
          WebMCP tool activity
        </p>
        <p className="mt-1 font-mono text-[11px] text-emerald-200/50">
          document.modelContext
        </p>
      </header>

      <div className="flex flex-wrap gap-1.5 border-b border-white/5 px-4 py-3">
        {registered.map((name) => {
          const used = tools.some((tool) => tool.name === name);
          return (
            <span
              key={name}
              className={cn(
                "rounded-md px-1.5 py-0.5 font-mono text-[10px]",
                used
                  ? "bg-emerald-400/15 text-emerald-200"
                  : "bg-white/4 text-zinc-500",
              )}
            >
              {used ? "✓ " : ""}
              {name}
            </span>
          );
        })}
      </div>

      <ol className="flex-1 space-y-3 overflow-auto p-4">
        {tools.length === 0 && (
          <li className="font-mono text-xs text-zinc-600">
            No tool calls yet. Submit a goal to watch the agent use this page.
          </li>
        )}
        {tools.map((tool) => (
          <li
            key={tool.id}
            className="rounded-xl border border-white/6 bg-black/30 p-3 font-mono text-[11px] leading-relaxed"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-emerald-200">{tool.name}</span>
              <span className="text-zinc-600">{formatClock(tool.timestamp)}</span>
            </div>
            <pre className="mt-2 overflow-x-auto text-zinc-400">
              {JSON.stringify(tool.input, null, 2)}
            </pre>
            <p className="mt-2 text-zinc-500">
              {tool.status === "running"
                ? "running…"
                : tool.status === "error"
                  ? `error: ${tool.error}`
                  : `result: ${summarizeResult(tool.result)}`}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
