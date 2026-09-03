import Link from "next/link";
import { notFound } from "next/navigation";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { RequestTaskerButton } from "@/components/site/RequestTaskerButton";
import { formatSlotLabel } from "@/lib/mock-data/availability";
import { getServiceBySlug } from "@/lib/mock-data/services";
import { getTaskerById } from "@/lib/mock-data/taskers";
import { MapPin, Star } from "lucide-react";

export default async function TaskerProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { id } = await params;
  const { service } = await searchParams;
  const tasker = getTaskerById(id);
  if (!tasker) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm text-zinc-500">
        <Link href="/taskers" className="hover:text-zinc-900">
          Taskers
        </Link>{" "}
        / {tasker.name}
      </p>
      <div className="mt-6 flex flex-col gap-6 rounded-3xl border border-zinc-200 bg-white p-6 sm:flex-row">
        <InitialsAvatar name={tasker.name} initials={tasker.avatar} size="lg" />
        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            {tasker.name}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {tasker.rating} · {tasker.completedTasks} tasks completed
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {tasker.distance} miles away
            </span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">{tasker.bio}</p>
          <p className="mt-4 text-2xl font-semibold text-zinc-950">
            ${tasker.hourlyRate}
            <span className="text-sm font-normal text-zinc-500"> / hr</span>
          </p>
          <div className="mt-5">
            <RequestTaskerButton tasker={tasker} defaultService={service} />
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-medium text-zinc-950">Services</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {tasker.services.map((slug) => (
            <Link
              key={slug}
              href={`/services/${slug}`}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 hover:border-emerald-300"
            >
              {getServiceBySlug(slug)?.name ?? slug}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium text-zinc-950">Availability</h2>
        <ul className="mt-3 space-y-2">
          {tasker.availability.map((slot) => (
            <li
              key={`${slot.date}-${slot.start}`}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"
            >
              {formatSlotLabel(slot)} – {formatSlotLabel({ ...slot, start: slot.end }).split(" · ")[1]}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
