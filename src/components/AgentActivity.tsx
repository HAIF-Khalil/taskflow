"use client";

import { useActivity } from "@/hooks/use-activity";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";

export function AgentActivity() {
  const { notes, tools } = useActivity();
  const feed = [
    ...notes.map((note) => ({
      id: note.id,
      time: note.timestamp,
      text: note.message,
      kind: "note" as const,
    })),
    ...tools
      .filter((tool) => tool.status === "ok")
      .map((tool) => ({
        id: tool.id,
        time: tool.timestamp,
        text: `→ ${tool.name}()`,
        kind: "tool" as const,
      })),
  ].sort((a, b) => a.time - b.time);

  return (
    <section className="flex h-full min-h-72 flex-col rounded-2xl border border-white/8 bg-zinc-950/70">
      <header className="flex items-center justify-between border-b border-white/6 px-4 py-3">
        <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
          Agent activity
        </p>
        <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
      </header>
      <ol className="flex-1 space-y-3 overflow-auto p-4 font-mono text-[12px] leading-relaxed">
        {feed.length === 0 && (
          <li className="text-zinc-600">Waiting for the agent…</li>
        )}
        {feed.map((item) => (
          <li key={item.id} className="flex gap-3">
            <time className="shrink-0 text-zinc-600">{formatClock(item.time)}</time>
            <span
              className={cn(
                item.kind === "tool" ? "text-amber-200/90" : "text-zinc-300",
              )}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
