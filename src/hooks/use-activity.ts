"use client";

import { useSyncExternalStore } from "react";
import { activity } from "@/lib/webmcp/activity";

export function useActivity() {
  return useSyncExternalStore(
    activity.subscribe,
    activity.getSnapshot,
    activity.getSnapshot,
  );
}
