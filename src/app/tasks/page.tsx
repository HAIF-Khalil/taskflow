"use client";

import Link from "next/link";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { Button } from "@/components/ui/button";
import { useBookings } from "@/hooks/use-bookings";
import { cancelTask } from "@/lib/marketplace";
import { getServiceBySlug } from "@/lib/mock-data/services";
import { getTaskerById } from "@/lib/mock-data/taskers";
import { Sparkles, User } from "lucide-react";

export default function TasksPage() {
  const { bookings } = useBookings();
  const visible = [...bookings].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">My Tasks</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Bookings you made on the site and bookings the agent scheduled through WebMCP.
      </p>

      {visible.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
          <p className="font-medium text-zinc-900">No tasks yet</p>
          <p className="mt-1 text-sm text-zinc-500">
            Hire a Tasker yourself, or ask the agent to build a plan.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-500">
              <Link href="/#services">Browse services</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/taskers">Browse Taskers</Link>
            </Button>
          </div>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {visible.map((booking) => {
            const tasker = getTaskerById(booking.taskerId);
            const service = getServiceBySlug(booking.service);
            return (
              <li
                key={booking.requestId}
                className="rounded-2xl border border-zinc-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {tasker && (
                      <InitialsAvatar name={tasker.name} initials={tasker.avatar} />
                    )}
                    <div>
                      <p className="font-medium text-zinc-950">
                        {service?.name ?? booking.service}
                      </p>
                      <p className="text-sm text-zinc-600">{booking.description}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {tasker?.name} · {booking.date} · {booking.time}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-zinc-950">${booking.price}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 capitalize">
                    {booking.status}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                    {booking.source === "agent" ? (
                      <>
                        <Sparkles className="size-3" /> Booked by agent
                      </>
                    ) : (
                      <>
                        <User className="size-3" /> You booked
                      </>
                    )}
                  </span>
                  {booking.status === "scheduled" && booking.bookingId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-zinc-500"
                      onClick={() => cancelTask(booking.bookingId!)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
