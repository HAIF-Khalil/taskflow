import { activity } from "./activity";
import type {
  ModelContext,
  ModelContextExecuteToolOptions,
  ModelContextGetToolOptions,
  ModelContextRegisterToolOptions,
  ModelContextTool,
  RegisteredTool,
} from "./types";

const NAME_PATTERN = /^[A-Za-z0-9_.-]{1,128}$/;

type InternalTool = ModelContextTool & {
  exposedOrigins: string[];
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class ModelContextPolyfill extends EventTarget implements ModelContext {
  ontoolchange: ((this: ModelContext, ev: Event) => void) | null = null;
  private tools = new Map<string, InternalTool>();

  constructor() {
    super();
    this.addEventListener("toolchange", (event) => {
      this.ontoolchange?.call(this, event);
    });
  }

  async registerTool(
    tool: ModelContextTool,
    options: ModelContextRegisterToolOptions = {},
  ): Promise<void> {
    if (!tool.name || !NAME_PATTERN.test(tool.name) || !tool.description) {
      throw new DOMException(
        "Invalid tool name or description.",
        "InvalidStateError",
      );
    }
    if (this.tools.has(tool.name)) {
      throw new DOMException(
        `A tool named "${tool.name}" is already registered.`,
        "InvalidStateError",
      );
    }
    if (options.signal?.aborted) {
      throw options.signal.reason ?? new DOMException("Aborted", "AbortError");
    }

    const exposedOrigins = options.exposedTo ?? [];
    this.tools.set(tool.name, { ...tool, exposedOrigins });

    options.signal?.addEventListener("abort", () => {
      this.tools.delete(tool.name);
      this.dispatchEvent(new Event("toolchange"));
    });

    this.dispatchEvent(new Event("toolchange"));
  }

  async getTools(
    _options: ModelContextGetToolOptions = {},
  ): Promise<RegisteredTool[]> {
    const origin = window.location.origin;
    return [...this.tools.values()]
      .map((tool) => ({
        name: tool.name,
        title: tool.title ?? "",
        description: tool.description,
        inputSchema: tool.inputSchema,
        window,
        origin,
        annotations: tool.annotations,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async executeTool(
    tool: RegisteredTool,
    inputObject: object = {},
    options: ModelContextExecuteToolOptions = {},
  ): Promise<string> {
    const definition = this.tools.get(tool.name);
    if (!definition) {
      throw new DOMException(
        `Tool "${tool.name}" is not registered.`,
        "UnknownError",
      );
    }
    if (options.signal?.aborted) {
      throw options.signal.reason ?? new DOMException("Aborted", "AbortError");
    }

    const controller = new AbortController();
    const onAbort = () => controller.abort(options.signal?.reason);
    options.signal?.addEventListener("abort", onAbort);

    const callId = activity.startTool(definition.name, inputObject);
    try {
      await sleep(140);
      const result = await definition.execute(
        inputObject as Record<string, unknown>,
        { signal: controller.signal },
      );
      activity.finishTool(callId, result);
      return JSON.stringify(result ?? null);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      activity.failTool(callId, message);
      throw error;
    } finally {
      options.signal?.removeEventListener("abort", onAbort);
    }
  }
}

export function ensureWebMCP(): ModelContext {
  if (typeof document === "undefined") {
    throw new Error("WebMCP is only available in the browser.");
  }

  const existing = (
    document as Document & { modelContext?: ModelContext }
  ).modelContext;
  if (existing) return existing;

  const polyfill = new ModelContextPolyfill();
  Object.defineProperty(document, "modelContext", {
    configurable: true,
    enumerable: true,
    get: () => polyfill,
  });
  return polyfill;
}

export function getModelContext(): ModelContext {
  return ensureWebMCP();
}

export function isNativeWebMCP(): boolean {
  if (typeof document === "undefined") return false;
  const descriptor = Object.getOwnPropertyDescriptor(Document.prototype, "modelContext");
  return Boolean(descriptor && !descriptor.configurable);
}
