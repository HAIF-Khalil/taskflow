import Link from "next/link";
import { notFound } from "next/navigation";
import { TaskerListingCard } from "@/components/site/TaskerListingCard";
import { findTaskers } from "@/lib/marketplace";
import { getServiceBySlug } from "@/lib/mock-data/services";
import { serviceIcon } from "@/lib/service-icons";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const { taskers } = findTaskers({ service: slug });
  const Icon = serviceIcon(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-900">
          Home
        </Link>{" "}
        / Services
      </p>
      <div className="mt-4 flex items-start gap-4">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon className="size-5" />
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            {service.name}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-600">{service.description}</p>
          <p className="mt-2 text-sm text-zinc-500">
            {taskers.length} Taskers nearby · typical job {service.typicalDurationHours} hours
          </p>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {taskers.map((tasker) => (
          <TaskerListingCard key={tasker.id} tasker={tasker} serviceSlug={slug} />
        ))}
      </div>
    </div>
  );
}
