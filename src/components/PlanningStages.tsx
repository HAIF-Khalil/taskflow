import { PLANNING_STAGES } from "@/types";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlanningStages({ current }: { current: number }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-[0.16em] text-amber-200/70 uppercase">
        Understanding your goal
      </p>
      <h2 className="font-heading mt-2 text-3xl tracking-tight text-zinc-50">
        Building a coordinated plan
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
        The agent is discovering this page&apos;s WebMCP tools and using them to search,
        compare, and schedule — without clicking through the marketplace.
      </p>

      <ol className="mt-10 space-y-3">
        {PLANNING_STAGES.map((stage, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li
              key={stage.id}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition",
                done && "border-emerald-400/15 bg-emerald-400/6",
                active && "border-amber-400/20 bg-amber-400/8",
                !done && !active && "border-white/6 bg-zinc-900/40",
              )}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-[11px] font-medium",
                  done && "bg-emerald-400 text-zinc-950",
                  active && "bg-amber-400 text-zinc-950",
                  !done && !active && "bg-zinc-800 text-zinc-500",
                )}
              >
                {done ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-sm",
                  done && "text-emerald-100",
                  active && "text-amber-50",
                  !done && !active && "text-zinc-500",
                )}
              >
                {stage.label}
              </span>
              {active && (
                <span className="ml-auto size-1.5 animate-pulse rounded-full bg-amber-300" />
              )}
              {done && (
                <span className="ml-auto text-xs text-emerald-400/80">Done</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
