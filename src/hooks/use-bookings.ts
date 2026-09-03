"use client";

import { useSyncExternalStore } from "react";
import { bookingStore } from "@/lib/marketplace";

export function useBookings() {
  return useSyncExternalStore(
    bookingStore.subscribe,
    bookingStore.getSnapshot,
    bookingStore.getServerSnapshot,
  );
}
