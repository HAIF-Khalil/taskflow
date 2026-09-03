"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useAgentDock } from "@/components/agent/AgentDockContext";
import { useBookings } from "@/hooks/use-bookings";
import { matchService } from "@/lib/marketplace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hexagon, MapPin, Search, Sparkles } from "lucide-react";

export function SiteHeader() {
  const router = useRouter();
  const { setOpen } = useAgentDock();
  const { bookings } = useBookings();
  const [query, setQuery] = useState("");
  const activeCount = bookings.filter((item) => item.status === "scheduled").length;

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const match = matchService(query);
    if (match) {
      router.push(`/services/${match.slug}`);
      return;
    }
    router.push(query.trim() ? `/taskers?q=${encodeURIComponent(query.trim())}` : "/taskers");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Hexagon className="size-4" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-zinc-950">
              TaskFlow
            </span>
            <Badge
              variant="secondary"
              className="hidden border-emerald-200 bg-emerald-50 text-[10px] font-medium tracking-wide text-emerald-800 uppercase sm:inline-flex"
            >
              WebMCP
            </Badge>
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-zinc-600 md:flex">
            <Link href="/#services" className="hover:text-zinc-950">
              Services
            </Link>
            <Link href="/taskers" className="hover:text-zinc-950">
              Browse Taskers
            </Link>
            <Link href="/tasks" className="hover:text-zinc-950">
              My Tasks
              {activeCount > 0 && (
                <span className="ml-1.5 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {activeCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        <form
          onSubmit={onSearch}
          className="hidden max-w-md flex-1 items-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-50 lg:flex"
        >
          <Search className="ml-3 size-4 text-zinc-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What do you need help with?"
            className="h-10 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
          />
          <span className="hidden items-center gap-1 border-l border-zinc-200 px-3 text-xs text-zinc-500 sm:flex">
            <MapPin className="size-3.5" />
            San Francisco
          </span>
          <Button
            type="submit"
            className="mr-1 h-8 rounded-full bg-emerald-600 px-3 text-white hover:bg-emerald-500"
          >
            Search
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => setOpen(true)}
            className="h-9 gap-1.5 rounded-full bg-zinc-950 px-3 text-white hover:bg-zinc-800"
          >
            <Sparkles className="size-3.5" />
            Ask an agent
          </Button>
          <InitialsAvatar name="Khalil Haif" initials="KH" size="sm" />
        </div>
      </div>
    </header>
  );
}
