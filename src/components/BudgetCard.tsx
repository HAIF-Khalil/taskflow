import { formatMoney } from "@/lib/format";
import type { Plan } from "@/types";

export function BudgetCard({ plan }: { plan: Plan }) {
  const total = plan.tasks.reduce((sum, task) => sum + task.price, 0);
  const remaining = plan.budget - total;
  const percent = Math.min(100, Math.round((total / plan.budget) * 100));

  return (
    <section className="rounded-2xl border border-white/8 bg-zinc-900/60 p-4">
      <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
        Your budget
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{formatMoney(plan.budget)}</p>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-zinc-400">
          <dt>Estimated total</dt>
          <dd className="text-zinc-100">{formatMoney(total)}</dd>
        </div>
        <div className="flex justify-between text-zinc-400">
          <dt>Remaining</dt>
          <dd className={remaining >= 0 ? "text-emerald-300" : "text-red-300"}>
            {formatMoney(remaining)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-amber-400"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-zinc-500">{percent}% of budget</p>
    </section>
  );
}
