import { activity } from "./activity";
import { getModelContext } from "./polyfill";
import type { RegisteredTool } from "./types";

let cachedTools: RegisteredTool[] | null = null;

export async function discoverTools(): Promise<RegisteredTool[]> {
  const ctx = getModelContext();
  activity.addNote("Discovering marketplace tools via modelContext.getTools()");
  const tools = await ctx.getTools();
  cachedTools = tools;
  activity.addNote(`Found ${tools.length} WebMCP tools on this page.`);
  return tools;
}

export async function callTool<T>(
  name: string,
  input: Record<string, unknown> = {},
): Promise<T> {
  const ctx = getModelContext();
  const tools = cachedTools ?? (await ctx.getTools());
  cachedTools = tools;
  const tool = tools.find((item) => item.name === name);
  if (!tool) {
    throw new Error(`WebMCP tool not found: ${name}`);
  }
  const raw = await ctx.executeTool(tool, input);
  return JSON.parse(raw) as T;
}

export function resetToolCache() {
  cachedTools = null;
}
