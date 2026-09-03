"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { matchService } from "@/lib/marketplace";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("Furniture assembly");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const match = matchService(query);
    router.push(match ? `/services/${match.slug}` : `/taskers?q=${encodeURIComponent(query)}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg sm:flex-row"
    >
      <div className="flex flex-1 items-center px-3">
        <Search className="size-4 text-zinc-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-12 flex-1 bg-transparent px-3 text-sm outline-none"
          placeholder="What do you need help with?"
        />
      </div>
      <div className="flex items-center gap-2 border-t border-zinc-200 px-3 py-2 sm:border-t-0 sm:border-l">
        <MapPin className="size-4 text-zinc-400" />
        <span className="text-sm text-zinc-600">San Francisco</span>
        <Button
          type="submit"
          className="ml-2 h-9 rounded-xl bg-emerald-600 px-4 text-white hover:bg-emerald-500"
        >
          Get help
        </Button>
      </div>
    </form>
  );
}
