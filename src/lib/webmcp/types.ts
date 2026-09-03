/**
 * TypeScript surface of the WebMCP IDL:
 * https://webmachinelearning.github.io/webmcp/
 */

export interface ToolAnnotations {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
}

export interface ToolExecuteCallbackOptions {
  signal: AbortSignal;
}

export type ToolExecuteCallback = (
  inputObject: Record<string, unknown>,
  options: ToolExecuteCallbackOptions,
) => Promise<unknown>;

export interface ModelContextTool {
  name: string;
  title?: string;
  description: string;
  inputSchema?: object;
  execute: ToolExecuteCallback;
  annotations?: ToolAnnotations;
}

export interface ModelContextRegisterToolOptions {
  exposedTo?: string[];
  signal?: AbortSignal;
}

export interface ModelContextGetToolOptions {
  fromOrigins?: string[];
}

export interface ModelContextExecuteToolOptions {
  signal?: AbortSignal;
}

export interface RegisteredTool {
  name: string;
  title?: string;
  description: string;
  inputSchema?: object;
  window: Window;
  origin: string;
  annotations?: ToolAnnotations;
}

export interface ModelContext extends EventTarget {
  registerTool(
    tool: ModelContextTool,
    options?: ModelContextRegisterToolOptions,
  ): Promise<void>;
  getTools(options?: ModelContextGetToolOptions): Promise<RegisteredTool[]>;
  executeTool(
    tool: RegisteredTool,
    inputObject?: object,
    options?: ModelContextExecuteToolOptions,
  ): Promise<string>;
  ontoolchange: ((this: ModelContext, ev: Event) => void) | null;
}

declare global {
  interface Document {
    readonly modelContext: ModelContext;
  }
}

export {};
