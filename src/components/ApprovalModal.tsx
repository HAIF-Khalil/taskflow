"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatMoney } from "@/lib/format";
import type { Plan } from "@/types";

export function ApprovalModal({
  plan,
  open,
  onCancel,
  onConfirm,
}: {
  plan: Plan;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const total = plan.tasks.reduce((sum, task) => sum + task.price, 0);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="border-white/10 bg-zinc-950 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>You&apos;re about to schedule {plan.tasks.length} tasks.</DialogTitle>
          <DialogDescription>
            Review the requests before the agent sends them through WebMCP.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-2 text-sm">
          {plan.tasks.map((task) => (
            <li key={task.id} className="flex justify-between text-zinc-300">
              <span>{task.serviceName}</span>
              <span>{formatMoney(task.price)}</span>
            </li>
          ))}
          <li className="flex justify-between border-t border-white/8 pt-2 font-medium text-zinc-50">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </li>
        </ul>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-amber-400 text-zinc-950 hover:bg-amber-300"
          >
            Confirm schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
