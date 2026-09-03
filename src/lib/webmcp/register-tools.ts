import {
  cancelTask,
  createTaskRequest,
  findTaskers,
  getTaskerPricing,
  getTaskerProfile,
  listTaskerAvailability,
  searchServices,
  scheduleTask,
} from "@/lib/marketplace";
import { ensureWebMCP } from "./polyfill";

let registered = false;

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback?: number) {
  return typeof value === "number" ? value : fallback;
}

export async function registerMarketplaceTools() {
  const ctx = ensureWebMCP();
  if (registered) return ctx;

  const already = await ctx.getTools();
  if (already.some((tool) => tool.name === "searchServices")) {
    registered = true;
    return ctx;
  }

  await ctx.registerTool({
    name: "searchServices",
    title: "Search Services",
    description:
      "Find marketplace services that match a goal or natural-language query.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Goal or service query" },
      },
      required: ["query"],
    },
    annotations: { readOnlyHint: true },
    execute: async (input) => searchServices(asString(input.query)),
  });

  await ctx.registerTool({
    name: "findTaskers",
    title: "Find Taskers",
    description:
      "Find available Taskers for a service, optionally filtered by date and distance.",
    inputSchema: {
      type: "object",
      properties: {
        service: { type: "string", description: "Service slug" },
        date: { type: "string" },
        maxDistance: { type: "number" },
      },
      required: ["service"],
    },
    annotations: { readOnlyHint: true },
    execute: async (input) =>
      findTaskers({
        service: asString(input.service),
        date: asString(input.date) || undefined,
        maxDistance: asNumber(input.maxDistance),
      }),
  });

  await ctx.registerTool({
    name: "getTaskerProfile",
    title: "Get Tasker Profile",
    description: "Return a Tasker's public profile, ratings, and services.",
    inputSchema: {
      type: "object",
      properties: { taskerId: { type: "string" } },
      required: ["taskerId"],
    },
    annotations: { readOnlyHint: true },
    execute: async (input) => getTaskerProfile(asString(input.taskerId)),
  });

  await ctx.registerTool({
    name: "getTaskerAvailability",
    title: "Get Tasker Availability",
    description: "List upcoming availability windows for a Tasker.",
    inputSchema: {
      type: "object",
      properties: {
        taskerId: { type: "string" },
        date: { type: "string" },
      },
      required: ["taskerId"],
    },
    annotations: { readOnlyHint: true },
    execute: async (input) =>
      listTaskerAvailability(
        asString(input.taskerId),
        asString(input.date) || undefined,
      ),
  });

  await ctx.registerTool({
    name: "getTaskerPricing",
    title: "Get Tasker Pricing",
    description: "Estimate the price for a Tasker to complete a service.",
    inputSchema: {
      type: "object",
      properties: {
        taskerId: { type: "string" },
        service: { type: "string" },
        durationHours: { type: "number" },
      },
      required: ["taskerId", "service"],
    },
    annotations: { readOnlyHint: true },
    execute: async (input) =>
      getTaskerPricing({
        taskerId: asString(input.taskerId),
        service: asString(input.service),
        durationHours: asNumber(input.durationHours),
      }),
  });

  await ctx.registerTool({
    name: "createTaskRequest",
    title: "Create Task Request",
    description:
      "Create a task request for a Tasker. Does not schedule until confirmed.",
    inputSchema: {
      type: "object",
      properties: {
        service: { type: "string" },
        taskerId: { type: "string" },
        description: { type: "string" },
        price: { type: "number" },
      },
      required: ["service", "taskerId", "description", "price"],
    },
    annotations: { readOnlyHint: false },
    execute: async (input) =>
      createTaskRequest({
        service: asString(input.service),
        taskerId: asString(input.taskerId),
        description: asString(input.description),
        price: asNumber(input.price, 0) ?? 0,
        source: "agent",
      }),
  });

  await ctx.registerTool({
    name: "scheduleTask",
    title: "Schedule Task",
    description: "Schedule a previously created task request at a specific time.",
    inputSchema: {
      type: "object",
      properties: {
        requestId: { type: "string" },
        date: { type: "string" },
        time: { type: "string" },
      },
      required: ["requestId", "date", "time"],
    },
    annotations: { readOnlyHint: false },
    execute: async (input) =>
      scheduleTask({
        requestId: asString(input.requestId),
        date: asString(input.date),
        time: asString(input.time),
      }),
  });

  await ctx.registerTool({
    name: "cancelTask",
    title: "Cancel Task",
    description: "Cancel a scheduled task or open request.",
    inputSchema: {
      type: "object",
      properties: { bookingId: { type: "string" } },
      required: ["bookingId"],
    },
    execute: async (input) => cancelTask(asString(input.bookingId)),
  });

  registered = true;
  return ctx;
}

export function marketplaceToolNames() {
  return [
    "searchServices",
    "findTaskers",
    "getTaskerProfile",
    "getTaskerAvailability",
    "getTaskerPricing",
    "createTaskRequest",
    "scheduleTask",
    "cancelTask",
  ] as const;
}
