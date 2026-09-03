import { getAvailabilityForTasker } from "@/lib/mock-data/availability";
import { getServiceBySlug, services } from "@/lib/mock-data/services";
import { getTaskerById, taskers } from "@/lib/mock-data/taskers";
import type { Service, Tasker } from "@/types";

export type BookingSource = "human" | "agent";

export type Booking = {
  requestId: string;
  bookingId?: string;
  service: string;
  taskerId: string;
  description: string;
  price: number;
  date?: string;
  time?: string;
  status: "requested" | "scheduled" | "cancelled";
  source: BookingSource;
  createdAt: number;
};

const DEMO_PRICES: Record<string, number> = {
  "tsk-marcus:furniture-assembly": 85,
  "tsk-sarah:home-cleaning": 95,
  "tsk-david:tv-mounting": 60,
};

type Snapshot = { bookings: Booking[] };

const EMPTY_SNAPSHOT: Snapshot = { bookings: [] };

class BookingStore {
  items: Booking[] = [];
  private snapshot: Snapshot = { bookings: [] };
  private listeners = new Set<() => void>();
  private hydrated = false;

  constructor() {
    this.hydrate();
  }

  private hydrate() {
    if (this.hydrated || typeof window === "undefined") return;
    this.hydrated = true;
    try {
      const raw = sessionStorage.getItem("taskflow-bookings");
      if (raw) {
        this.items = JSON.parse(raw) as Booking[];
        this.snapshot = { bookings: this.items };
      }
    } catch {
      /* ignore */
    }
  }

  subscribe = (listener: () => void) => {
    this.hydrate();
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => {
    this.hydrate();
    return this.snapshot;
  };

  getServerSnapshot = (): Snapshot => EMPTY_SNAPSHOT;

  private emit() {
    this.snapshot = { bookings: this.items };
    if (typeof window !== "undefined") {
      sessionStorage.setItem("taskflow-bookings", JSON.stringify(this.items));
    }
    this.listeners.forEach((listener) => listener());
  }

  replace(next: Booking[]) {
    this.items = next;
    this.emit();
  }
}

export const bookingStore = new BookingStore();

export function searchServices(query: string) {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = services.filter((service) => {
    const haystack = [
      service.name,
      service.slug,
      service.description,
      ...service.keywords,
    ]
      .join(" ")
      .toLowerCase();
    return tokens.some((token) => haystack.includes(token));
  });
  const results = matches.length ? matches : services;
  return {
    count: results.length,
    services: results.map((service) => ({
      id: service.id,
      name: service.name,
      slug: service.slug,
      description: service.description,
      typicalDurationHours: service.typicalDurationHours,
    })),
  };
}

export function findTaskers(input: {
  service: string;
  date?: string;
  maxDistance?: number;
}) {
  const results = taskers
    .filter((tasker) => tasker.services.includes(input.service))
    .filter((tasker) =>
      input.maxDistance ? tasker.distance <= input.maxDistance : true,
    )
    .filter((tasker) =>
      input.date
        ? tasker.availability.some((slot) => slot.date === input.date)
        : true,
    )
    .sort((a, b) => b.rating - a.rating || a.distance - b.distance);
  return { count: results.length, taskers: results };
}

export function getTaskerProfile(taskerId: string): Tasker {
  const tasker = getTaskerById(taskerId);
  if (!tasker) throw new Error("Tasker not found");
  return tasker;
}

export function listTaskerAvailability(taskerId: string, date?: string) {
  return { taskerId, slots: getAvailabilityForTasker(taskerId, date) };
}

export function getTaskerPricing(input: {
  taskerId: string;
  service: string;
  durationHours?: number;
}) {
  const tasker = getTaskerById(input.taskerId);
  if (!tasker) throw new Error("Tasker not found");
  const service = getServiceBySlug(input.service);
  const durationHours =
    input.durationHours ?? service?.typicalDurationHours ?? 1;
  const override = DEMO_PRICES[`${tasker.id}:${input.service}`];
  const amount = override ?? Math.round(tasker.hourlyRate * durationHours);
  return {
    taskerId: tasker.id,
    service: input.service,
    hourlyRate: tasker.hourlyRate,
    durationHours,
    amount,
  };
}

export function createTaskRequest(input: {
  service: string;
  taskerId: string;
  description: string;
  price: number;
  source: BookingSource;
}) {
  const requestId = `req-${crypto.randomUUID().slice(0, 8)}`;
  const booking: Booking = {
    requestId,
    service: input.service,
    taskerId: input.taskerId,
    description: input.description,
    price: input.price,
    status: "requested",
    source: input.source,
    createdAt: Date.now(),
  };
  bookingStore.replace([...bookingStore.items, booking]);
  return { requestId, status: "requested" as const };
}

export function scheduleTask(input: {
  requestId: string;
  date: string;
  time: string;
}) {
  const booking = bookingStore.items.find(
    (item) => item.requestId === input.requestId,
  );
  if (!booking) throw new Error("Task request not found");
  const next: Booking = {
    ...booking,
    date: input.date,
    time: input.time,
    status: "scheduled",
    bookingId: `bkg-${crypto.randomUUID().slice(0, 8)}`,
  };
  bookingStore.replace(
    bookingStore.items.map((item) =>
      item.requestId === input.requestId ? next : item,
    ),
  );
  return {
    bookingId: next.bookingId,
    requestId: next.requestId,
    date: next.date,
    time: next.time,
    status: next.status,
  };
}

export function cancelTask(bookingId: string) {
  const booking = bookingStore.items.find((item) => item.bookingId === bookingId);
  if (!booking) throw new Error("Booking not found");
  bookingStore.replace(
    bookingStore.items.map((item) =>
      item.bookingId === bookingId ? { ...item, status: "cancelled" as const } : item,
    ),
  );
  return { bookingId, status: "cancelled" as const };
}

export function bookTasker(input: {
  service: string;
  taskerId: string;
  description: string;
  date: string;
  time: string;
  source: BookingSource;
  durationHours?: number;
}) {
  const pricing = getTaskerPricing({
    taskerId: input.taskerId,
    service: input.service,
    durationHours: input.durationHours,
  });
  const request = createTaskRequest({
    service: input.service,
    taskerId: input.taskerId,
    description: input.description,
    price: pricing.amount,
    source: input.source,
  });
  return {
    ...scheduleTask({
      requestId: request.requestId,
      date: input.date,
      time: input.time,
    }),
    price: pricing.amount,
  };
}

export function resetBookings() {
  bookingStore.replace([]);
}

export function matchService(query: string): Service | undefined {
  const normalized = query.toLowerCase().trim();
  return (
    getServiceBySlug(normalized) ??
    services.find(
      (service) =>
        service.name.toLowerCase() === normalized ||
        service.keywords.some((keyword) => normalized.includes(keyword)),
    )
  );
}

export { services, getServiceBySlug };
