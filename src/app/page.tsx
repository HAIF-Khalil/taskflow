import Link from "next/link";
import { HeroSearch } from "@/components/site/HeroSearch";
import { TaskerListingCard } from "@/components/site/TaskerListingCard";
import { Button } from "@/components/ui/button";
import { serviceIcon } from "@/lib/service-icons";
import { services } from "@/lib/mock-data/services";
import { getTaskerById } from "@/lib/mock-data/taskers";
import { AskAgentButton } from "@/components/site/AskAgentButton";
import { Check, MousePointerClick, Sparkles, Users } from "lucide-react";

const FEATURED_IDS = ["tsk-marcus", "tsk-sarah", "tsk-david", "tsk-omar"];

export default function HomePage() {
  const featured = FEATURED_IDS.map((id) => getTaskerById(id)).filter(
    (tasker): tasker is NonNullable<typeof tasker> => Boolean(tasker),
  );

  return (
    <div>
      <section className="border-b border-emerald-100 bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">
            For people and for agents
          </p>
          <h1 className="font-heading mt-3 max-w-2xl text-4xl leading-tight tracking-tight text-zinc-950 sm:text-5xl">
            Get help. Hire a Tasker.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
            Browse and book like a normal marketplace. The same page also exposes WebMCP
            tools, so an AI agent can search, compare, and schedule without clicking around.
          </p>
          <HeroSearch />
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Popular services
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Pick a category, or let the agent decompose a goal into these same services.
            </p>
          </div>
          <Link href="/taskers" className="text-sm font-medium text-emerald-700 hover:underline">
            See all Taskers
          </Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((service) => {
            const Icon = serviceIcon(service.slug);
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-sm"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon className="size-4.5" />
                </span>
                <p className="mt-3 text-sm font-medium text-zinc-950">{service.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{service.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">How it works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: MousePointerClick,
                title: "You can click",
                body: "Search a service, compare Taskers, and book a time yourself — the usual marketplace path.",
              },
              {
                icon: Sparkles,
                title: "An agent can call tools",
                body: "This site registers searchServices, findTaskers, pricing, and scheduleTask on document.modelContext.",
              },
              {
                icon: Users,
                title: "One shared schedule",
                body: "Human bookings and agent bookings land in My Tasks together. Same capabilities, two clients.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-zinc-200 bg-white p-5">
                <item.icon className="size-5 text-emerald-700" />
                <h3 className="mt-3 font-medium text-zinc-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Featured Taskers
          </h2>
          <Button asChild variant="outline">
            <Link href="/taskers">Browse all</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((tasker) => (
            <TaskerListingCard key={tasker.id} tasker={tasker} />
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-emerald-700">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-emerald-100">
              <Check className="size-4" />
              Dual-use website
            </p>
            <h2 className="font-heading mt-2 text-3xl tracking-tight">
              Don&apos;t want to shop around? Ask the agent.
            </h2>
            <p className="mt-2 max-w-lg text-sm text-emerald-50/80">
              Describe an outcome like “make my apartment ready tonight.” The agent uses this
              page’s WebMCP tools and asks you to approve before anything is booked.
            </p>
          </div>
          <AskAgentButton />
        </div>
      </section>
    </div>
  );
}
