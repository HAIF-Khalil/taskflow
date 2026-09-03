import { TaskerListingCard } from "@/components/site/TaskerListingCard";
import { matchService } from "@/lib/marketplace";
import { taskers } from "@/lib/mock-data/taskers";

export default async function TaskersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const match = q ? matchService(q) : undefined;
  const list = match
    ? taskers.filter((tasker) => tasker.services.includes(match.slug))
    : [...taskers].sort((a, b) => b.rating - a.rating);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Browse Taskers</h1>
      <p className="mt-2 text-sm text-zinc-600">
        {match
          ? `${list.length} Taskers for ${match.name}`
          : `${list.length} Taskers in San Francisco`}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((tasker) => (
          <TaskerListingCard
            key={tasker.id}
            tasker={tasker}
            serviceSlug={match?.slug}
          />
        ))}
      </div>
    </div>
  );
}
