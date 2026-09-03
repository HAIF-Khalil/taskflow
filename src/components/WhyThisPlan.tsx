"use client";

import { useState } from "react";
import type { Plan } from "@/types";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhyThisPlan({ plan }: { plan: Plan }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="rounded-2xl border border-white/8 bg-zinc-900/60">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-medium text-zinc-100">Why this plan?</span>
        <ChevronDown
          className={cn("size-4 text-zinc-500 transition", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="space-y-3 border-t border-white/6 px-4 py-3">
          <p className="text-sm leading-relaxed text-zinc-300">{plan.summary}</p>
          {plan.tasks.map((task) => (
            <p key={task.id} className="text-sm leading-relaxed text-zinc-400">
              {task.reason}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
