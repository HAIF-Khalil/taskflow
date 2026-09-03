import Link from "next/link";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { Button } from "@/components/ui/button";
import { formatSlotLabel } from "@/lib/mock-data/availability";
import { getServiceBySlug } from "@/lib/mock-data/services";
import type { Tasker } from "@/types";
import { MapPin, Star } from "lucide-react";

export function TaskerListingCard({
  tasker,
  serviceSlug,
}: {
  tasker: Tasker;
  serviceSlug?: string;
}) {
  const nextSlot = tasker.availability[0];
  const href = serviceSlug
    ? `/taskers/${tasker.id}?service=${serviceSlug}`
    : `/taskers/${tasker.id}`;

  return (
    <article className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <InitialsAvatar name={tasker.name} initials={tasker.avatar} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-zinc-950">{tasker.name}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-500">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {tasker.rating}
            <span>·</span>
            {tasker.completedTasks} tasks
          </p>
        </div>
        <p className="text-right">
          <span className="text-lg font-semibold text-zinc-950">${tasker.hourlyRate}</span>
          <span className="block text-xs text-zinc-500">/hr</span>
        </p>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-zinc-600">{tasker.bio}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tasker.services.map((slug) => (
          <span
            key={slug}
            className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600"
          >
            {getServiceBySlug(slug)?.name ?? slug}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <MapPin className="size-3.5" />
          {tasker.distance} miles
        </span>
        {nextSlot && <span>Next: {formatSlotLabel(nextSlot)}</span>}
      </div>
      <Button asChild className="mt-4 h-9 bg-emerald-600 text-white hover:bg-emerald-500">
        <Link href={href}>Select Tasker</Link>
      </Button>
    </article>
  );
}
