"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatSlotLabel } from "@/lib/mock-data/availability";
import { getServiceBySlug } from "@/lib/mock-data/services";
import { bookTasker, getTaskerPricing } from "@/lib/marketplace";
import type { Tasker } from "@/types";

export function BookingDialog({
  tasker,
  open,
  onOpenChange,
  defaultService,
}: {
  tasker: Tasker;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultService?: string;
}) {
  const initialService =
    defaultService && tasker.services.includes(defaultService)
      ? defaultService
      : tasker.services[0];
  const [service, setService] = useState(initialService);
  const [slotIndex, setSlotIndex] = useState(0);
  const [description, setDescription] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slot = tasker.availability[slotIndex] ?? tasker.availability[0];
  const serviceMeta = getServiceBySlug(service);
  const pricing = useMemo(
    () =>
      getTaskerPricing({
        taskerId: tasker.id,
        service,
        durationHours: serviceMeta?.typicalDurationHours,
      }),
    [tasker.id, service, serviceMeta?.typicalDurationHours],
  );

  function confirm() {
    if (!slot) return;
    try {
      setError(null);
      const dateLabel =
        slot.date === "today"
          ? "Today"
          : slot.date === "tomorrow"
            ? "Tomorrow"
            : slot.date[0].toUpperCase() + slot.date.slice(1);
      const time = formatSlotLabel(slot).split(" · ")[1];
      bookTasker({
        service,
        taskerId: tasker.id,
        description:
          description.trim() ||
          `${serviceMeta?.name ?? service} with ${tasker.name}`,
        date: dateLabel,
        time,
        source: "human",
        durationHours: serviceMeta?.typicalDurationHours,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not book");
    }
  }

  function close() {
    onOpenChange(false);
    setTimeout(() => {
      setDone(false);
      setDescription("");
      setError(null);
    }, 200);
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="sm:max-w-md">
        {done ? (
          <>
            <DialogHeader>
              <DialogTitle>You&apos;re booked</DialogTitle>
              <DialogDescription>
                {tasker.name} is scheduled for {formatSlotLabel(slot)} · ${pricing.amount}.
                This uses the same marketplace booking path agents call through WebMCP.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" onClick={close} className="bg-emerald-600 text-white hover:bg-emerald-500">
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Request {tasker.name}</DialogTitle>
              <DialogDescription>
                Book this Tasker yourself. The agent uses the same create/schedule functions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <label className="block">
                <span className="text-xs font-medium text-zinc-500">Service</span>
                <select
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-zinc-200 bg-white px-2"
                >
                  {tasker.services.map((slug) => (
                    <option key={slug} value={slug}>
                      {getServiceBySlug(slug)?.name ?? slug}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-medium text-zinc-500">Time</span>
                <select
                  value={slotIndex}
                  onChange={(event) => setSlotIndex(Number(event.target.value))}
                  className="mt-1 h-9 w-full rounded-lg border border-zinc-200 bg-white px-2"
                >
                  {tasker.availability.map((item, index) => (
                    <option key={`${item.date}-${item.start}`} value={index}>
                      {formatSlotLabel(item)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-medium text-zinc-500">What do you need?</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none"
                  placeholder="Assemble a bed and a desk…"
                />
              </label>
              <p className="text-zinc-600">
                Estimated total{" "}
                <span className="font-semibold text-zinc-950">${pricing.amount}</span>
              </p>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirm}
                className="bg-emerald-600 text-white hover:bg-emerald-500"
              >
                Confirm booking
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
