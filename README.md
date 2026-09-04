# TaskFlow

**A marketplace for people — and for agents.**

TaskFlow is a TaskRabbit-style site you can browse and book by hand. The same pages register [WebMCP](https://webmachinelearning.github.io/webmcp/) tools on `document.modelContext`, so an in-page agent can search, compare, and schedule through those tools. Both paths write to **My Tasks**.

No backend, no real payments, no TaskRabbit API. Mock data and a deterministic planner (no LLM).

## Demo (2–3 minutes)

1. Open Furniture Assembly, book Marcus from his profile.
2. Click **Ask an agent**. Use: *I just moved into my apartment. Make my home ready tonight. I have a $250 budget.*
3. Watch **WebMCP** tool calls (`searchServices`, `findTaskers`, `getTaskerPricing`, …).
4. **Approve & Schedule** the $240 plan.
5. Open **My Tasks** — *You booked* next to *Booked by agent*.

## WebMCP

On load the marketplace registers tools with the official API shape:

```ts
await document.modelContext.registerTool({
  name: "searchServices",
  description: "Find marketplace services matching a goal or query.",
  inputSchema: { type: "object", properties: { query: { type: "string" } } },
  execute: async (input, { signal }) => { /* same functions as the UI */ },
});

const tools = await document.modelContext.getTools();
await document.modelContext.executeTool(tool, { query: "move-in preparation" });
```

Tools: `searchServices`, `findTaskers`, `getTaskerProfile`, `getTaskerAvailability`, `getTaskerPricing`, `createTaskRequest`, `scheduleTask`, `cancelTask`.

Most browsers do not ship `document.modelContext` yet. A spec-faithful polyfill is installed at boot; native WebMCP is used if present.

Human **Request this Tasker** and the agent’s `executeTool` both call [`src/lib/marketplace.ts`](src/lib/marketplace.ts).

## Run locally

```bash
cd taskflow
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui.

## What’s in the repo

```
src/app/                 Home, /services/[slug], /taskers, /tasks
src/lib/marketplace.ts   Shared search / book / schedule
src/lib/webmcp/          Polyfill, tool registration, activity log
src/lib/agent/           Deterministic planner + executor
src/components/site/     Marketplace UI
src/components/agent/    Agent dock
```

## Spec

[WebMCP Community Group Report](https://webmachinelearning.github.io/webmcp/)
