import { TaskCard } from "@/components/TaskCard";
import type { Plan, PlanTask } from "@/types";

export function PlanTimeline({
  plan,
  interactive,
  onChangeTasker,
  onChangeTime,
}: {
  plan: Plan;
  interactive?: boolean;
  onChangeTasker?: (task: PlanTask) => void;
  onChangeTime?: (task: PlanTask) => void;
}) {
  return (
    <div className="relative space-y-6">
      <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
        {plan.tasks[0]?.dateLabel ?? "Schedule"}
      </p>
      <div className="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-white/8">
        {plan.tasks.map((task) => (
          <div key={task.id} className="relative grid gap-3 pl-7">
            <div className="absolute top-3 left-0 size-2 rounded-full bg-amber-300 shadow-[0_0_0_4px_rgba(251,191,36,0.12)]" />
            <p className="text-xs font-medium text-zinc-400">{task.time}</p>
            <TaskCard
              task={task}
              interactive={interactive}
              onChangeTasker={() => onChangeTasker?.(task)}
              onChangeTime={() => onChangeTime?.(task)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
