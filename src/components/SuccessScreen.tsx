"use client";

import { PlanTimeline } from "@/components/PlanTimeline";
import { Button } from "@/components/ui/button";
import { formatDuration, formatMoney } from "@/lib/format";
import type { Plan } from "@/types";
import { Check } from "lucide-react";

export function SuccessScreen({
  plan,
  onReset,
}: {
  plan: Plan;
  onReset: () => void;
}) {
  const total = plan.tasks.reduce((sum, task) => sum + task.price, 0);
  const hours = plan.tasks.reduce((sum, task) => sum + task.durationHours, 0);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex size-12 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
        <Check className="size-6" />
      </div>
      <h1 className="font-heading mt-5 text-4xl tracking-tight">You&apos;re all set.</h1>
      <p className="mt-2 text-zinc-400">
        Your apartment-ready plan is scheduled. {plan.tasks.length} tasks ·{" "}
        {formatDuration(hours)} · {formatMoney(total)} total.
      </p>
      <div className="mt-10">
        <PlanTimeline plan={plan} />
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <Button
          type="button"
          className="bg-amber-400 text-zinc-950 hover:bg-amber-300"
          onClick={() =>
            document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          View schedule
        </Button>
        <Button type="button" variant="outline" onClick={onReset}>
          Start another task
        </Button>
      </div>
    </div>
  );
}
