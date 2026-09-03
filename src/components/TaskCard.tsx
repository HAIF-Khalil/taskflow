"use client";

import { InitialsAvatar } from "@/components/InitialsAvatar";
import { Button } from "@/components/ui/button";
import { formatDuration, formatMoney } from "@/lib/format";
import type { PlanTask } from "@/types";
import {
  Armchair,
  Bolt,
  Droplets,
  Hammer,
  Monitor,
  Package,
  Sparkles,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "furniture-assembly": Armchair,
  "home-cleaning": Sparkles,
  "tv-mounting": Monitor,
  "moving-help": Truck,
  handyman: Hammer,
  plumbing: Droplets,
  electrical: Bolt,
  "yard-work": Sparkles,
  delivery: Package,
  "packing-unpacking": Package,
};

export function TaskCard({
  task,
  onChangeTasker,
  onChangeTime,
  interactive,
}: {
  task: PlanTask;
  onChangeTasker?: () => void;
  onChangeTime?: () => void;
  interactive?: boolean;
}) {
  const Icon = ICONS[task.serviceId] ?? Wrench;

  return (
    <article className="rounded-2xl border border-white/8 bg-zinc-900/60 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <Icon className="size-4.5" />
          </div>
          <div>
            <h3 className="text-[15px] font-medium text-zinc-50">{task.serviceName}</h3>
            <p className="mt-0.5 text-sm text-zinc-400">{task.description}</p>
          </div>
        </div>
        <p className="text-lg font-semibold tracking-tight text-zinc-50">
          {formatMoney(task.price)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/6 pt-4">
        <InitialsAvatar name={task.tasker.name} initials={task.tasker.avatar} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-100">{task.tasker.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-400">
            <Star className="size-3 fill-amber-300 text-amber-300" />
            {task.tasker.rating}
            <span className="text-zinc-600">·</span>
            {task.tasker.completedTasks} tasks
          </p>
        </div>
        <div className="text-right text-xs text-zinc-400">
          <p>
            {task.dateLabel} · {task.time}
          </p>
          <p className="mt-0.5">
            {formatDuration(task.durationHours)} · {task.distance} miles
          </p>
        </div>
      </div>

      {interactive && (
        <div className="mt-4 flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onChangeTasker}>
            Change Tasker
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onChangeTime}>
            Change Time
          </Button>
        </div>
      )}
    </article>
  );
}
