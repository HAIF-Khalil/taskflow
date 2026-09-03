import { callTool, discoverTools } from "@/lib/webmcp/client";
import { activity } from "@/lib/webmcp/activity";
import { toDisplayTime } from "@/lib/mock-data/availability";
import { getServiceBySlug } from "@/lib/mock-data/services";
import type { Plan, PlanTask, Tasker } from "@/types";
import { PLANNING_STAGES } from "@/types";

type FindTaskersResult = { count: number; taskers: Tasker[] };
type PricingResult = { amount: number; durationHours: number };
type AvailabilityResult = { slots: { date: string; start: string; end: string }[] };
type SearchResult = { count: number; services: { slug: string; name: string }[] };

type ScenarioTask = {
  service: string;
  preferredTaskerName: string;
  description: string;
  reason: string;
  date: string;
  time?: string;
  durationHours: number;
};

type Scenario = {
  id: string;
  match: (prompt: string) => boolean;
  title: string;
  headline: string;
  budget: number;
  searchQuery: string;
  summary: (total: number, budget: number) => string;
  tasks: ScenarioTask[];
};

const MOVE_IN: Scenario = {
    id: "move-in",
    match: (prompt) =>
      /moved|move-in|home ready|tonight|\$250|250/.test(prompt) ||
      (/apartment/.test(prompt) && /ready|tonight|moved|budget/.test(prompt)),
    title: "Your apartment-ready plan",
    headline: "Make my home ready for tonight",
    budget: 250,
    searchQuery: "move-in preparation",
    summary: (total, budget) =>
      `I found a plan that gets your apartment ready tonight for $${total}, leaving $${budget - total} of your budget.`,
    tasks: [
      {
        service: "furniture-assembly",
        preferredTaskerName: "Marcus Johnson",
        description: "Assemble bed + desk",
        reason:
          "I chose Marcus because he has 4.9 stars, has completed 312 furniture assembly tasks, is 2.4 miles away, and is available before your cleaning appointment.",
        date: "today",
        time: "4:00 PM",
        durationHours: 2,
      },
      {
        service: "home-cleaning",
        preferredTaskerName: "Sarah Williams",
        description: "2-bedroom apartment cleaning",
        reason:
          "I selected Sarah because her availability overlaps with the furniture assembly window and keeps the total under your $250 budget.",
        date: "today",
        time: "5:00 PM",
        durationHours: 1.5,
      },
      {
        service: "tv-mounting",
        preferredTaskerName: "David Chen",
        description: "Mount living-room TV and hide cables",
        reason:
          "David is a 4.9 specialist with 421 completed mounts and a 6:30 PM window after cleaning, so the apartment is staged last.",
        date: "today",
        time: "6:30 PM",
        durationHours: 1,
      },
    ],
  };

const SCENARIOS: Scenario[] = [
  {
    id: "party",
    match: (prompt) => /birthday|party/.test(prompt),
    title: "Your party-ready plan",
    headline: "Help me prepare for a birthday party",
    budget: 280,
    searchQuery: "birthday party preparation",
    summary: (total, budget) =>
      `I lined up cleaning, supply delivery, and a handyman so the party space is ready for $${total} ($${budget - total} left).`,
    tasks: [
      {
        service: "home-cleaning",
        preferredTaskerName: "Priya Patel",
        description: "Pre-party apartment clean",
        reason:
          "Priya has 4.9 stars for event cleaning and can finish before guests arrive.",
        date: "today",
        time: "3:00 PM",
        durationHours: 2,
      },
      {
        service: "delivery",
        preferredTaskerName: "Maya Singh",
        description: "Pick up decorations and supplies",
        reason:
          "Maya has 412 completed deliveries and a wide same-day window.",
        date: "today",
        time: "12:00 PM",
        durationHours: 1,
      },
      {
        service: "handyman",
        preferredTaskerName: "Omar Hassan",
        description: "Hang lights and set up folding tables",
        reason:
          "Omar can handle hanging and small setup without a second specialist.",
        date: "today",
        time: "1:00 PM",
        durationHours: 2,
      },
    ],
  },
  {
    id: "moving",
    match: (prompt) => /moving|weekend|boxes/.test(prompt),
    title: "Your weekend move plan",
    headline: "I need help moving this weekend",
    budget: 320,
    searchQuery: "weekend moving help",
    summary: (total, budget) =>
      `A coordinated Saturday crew — packing, moving, and assembly — for $${total}, $${budget - total} under budget.`,
    tasks: [
      {
        service: "packing-unpacking",
        preferredTaskerName: "Emma Thompson",
        description: "Pack kitchen and closet boxes",
        reason:
          "Emma is organized, nearby, and available Saturday morning to start the move.",
        date: "saturday",
        durationHours: 2.5,
      },
      {
        service: "moving-help",
        preferredTaskerName: "Luis Ramirez",
        description: "Load, transport, and unload furniture",
        reason:
          "Luis runs weekend moving help and overlaps with packing so nothing sits in the hallway.",
        date: "saturday",
        durationHours: 3,
      },
      {
        service: "furniture-assembly",
        preferredTaskerName: "James Wilson",
        description: "Rebuild bed and dining table at the new place",
        reason:
          "James can assemble after the truck arrives and also help with the last heavy pieces.",
        date: "saturday",
        durationHours: 2,
      },
    ],
  },
  {
    id: "fixes",
    match: (prompt) => /fix|repair|everything|broken/.test(prompt),
    title: "Your apartment fix-it plan",
    headline: "Fix everything that needs fixing",
    budget: 300,
    searchQuery: "apartment repairs handyman plumbing electrical",
    summary: (total, budget) =>
      `Three specialists cover the repair list for $${total}, with $${budget - total} remaining.`,
    tasks: [
      {
        service: "handyman",
        preferredTaskerName: "Omar Hassan",
        description: "Patch, hang, and general repairs",
        reason:
          "Omar has 340 completed jobs and can knock out the general list first.",
        date: "today",
        durationHours: 2,
      },
      {
        service: "plumbing",
        preferredTaskerName: "Andre Williams",
        description: "Fix dripping faucet and slow drain",
        reason:
          "Andre is a 4.9 plumber 2.6 miles away and available late morning.",
        date: "today",
        durationHours: 1.5,
      },
      {
        service: "electrical",
        preferredTaskerName: "Chris Nguyen",
        description: "Replace flickering fixture and dead outlet",
        reason:
          "Chris is licensed, so the electrical items stay off the general handyman ticket.",
        date: "today",
        durationHours: 1.5,
      },
    ],
  },
  MOVE_IN,
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function timeToMinutes(display: string) {
  const match = display.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + Number(match[2]);
}

function pickScenario(prompt: string): Scenario {
  const normalized = prompt.toLowerCase();
  return SCENARIOS.find((scenario) => scenario.match(normalized)) ?? MOVE_IN;
}

export async function swapTasker(task: PlanTask): Promise<PlanTask> {
  const found = await callTool<FindTaskersResult>("findTaskers", {
    service: task.serviceId,
  });
  if (!found.taskers.length) return task;
  const index = found.taskers.findIndex((item) => item.id === task.tasker.id);
  const next = found.taskers[(index + 1) % found.taskers.length];
  const pricing = await callTool<PricingResult>("getTaskerPricing", {
    taskerId: next.id,
    service: task.serviceId,
    durationHours: task.durationHours,
  });
  const availability = await callTool<AvailabilityResult>("getTaskerAvailability", {
    taskerId: next.id,
  });
  const slot = availability.slots[0];
  return {
    ...task,
    tasker: next,
    price: pricing.amount,
    distance: next.distance,
    time: slot ? toDisplayTime(slot.start) : task.time,
    reason: `I switched to ${next.name} (${next.rating}★, ${next.completedTasks} tasks, ${next.distance} miles).`,
  };
}

export async function runAgent(
  prompt: string,
  onStage: (index: number) => void,
): Promise<Plan> {
  const scenario = pickScenario(prompt);
  onStage(0);
  activity.addNote("Understanding your goal...");
  await sleep(500);

  await discoverTools();

  onStage(1);
  activity.addNote("Breaking the outcome into marketplace services...");
  await sleep(400);
  const search = await callTool<SearchResult>("searchServices", {
    query: scenario.searchQuery,
  });
  activity.addNote(`Found ${search.count} relevant services.`);

  onStage(2);
  const planned: PlanTask[] = [];

  for (const spec of scenario.tasks) {
    activity.addNote(`Finding ${spec.service.replace(/-/g, " ")} Taskers...`);
    const found = await callTool<FindTaskersResult>("findTaskers", {
      service: spec.service,
      date: spec.date,
    });
    const tasker =
      found.taskers.find((item) => item.name === spec.preferredTaskerName) ??
      found.taskers[0];
    if (!tasker) continue;

    onStage(3);
    activity.addNote(`Checking availability for ${tasker.name}...`);
    const availability = await callTool<AvailabilityResult>("getTaskerAvailability", {
      taskerId: tasker.id,
      date: spec.date,
    });
    const slot = availability.slots[0];
    const time = spec.time ?? (slot ? toDisplayTime(slot.start) : "4:00 PM");

    const pricing = await callTool<PricingResult>("getTaskerPricing", {
      taskerId: tasker.id,
      service: spec.service,
      durationHours: spec.durationHours,
    });

    planned.push({
      id: `task-${spec.service}`,
      serviceId: spec.service,
      serviceName: getServiceBySlug(spec.service)?.name ?? spec.service,
      description: spec.description,
      tasker,
      price: pricing.amount,
      durationHours: spec.durationHours,
      dateLabel:
        spec.date === "today"
          ? "Today"
          : spec.date === "saturday"
            ? "Saturday"
            : spec.date[0].toUpperCase() + spec.date.slice(1),
      time,
      distance: tasker.distance,
      reason: spec.reason,
      status: "proposed",
    });
  }

  onStage(4);
  activity.addNote("Comparing candidates and optimizing your schedule...");
  await sleep(1200);

  onStage(5);
  activity.addNote("Building your plan...");
  await sleep(500);

  planned.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

  const total = planned.reduce((sum, task) => sum + task.price, 0);
  activity.addNote("Plan ready.");

  return {
    title: scenario.title,
    headline: scenario.headline,
    budget: scenario.budget,
    tasks: planned,
    summary: scenario.summary(total, scenario.budget),
  };
}

export function stageLabel(index: number) {
  return PLANNING_STAGES[index]?.label ?? "";
}
