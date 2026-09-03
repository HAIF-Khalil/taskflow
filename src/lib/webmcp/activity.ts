export type ToolActivityStatus = "running" | "ok" | "error";

export type ToolActivity = {
  id: string;
  name: string;
  input: unknown;
  result?: unknown;
  error?: string;
  status: ToolActivityStatus;
  timestamp: number;
};

export type AgentNote = {
  id: string;
  message: string;
  timestamp: number;
};

type Snapshot = {
  tools: ToolActivity[];
  notes: AgentNote[];
};

class ActivityStore {
  tools: ToolActivity[] = [];
  notes: AgentNote[] = [];
  private snapshot: Snapshot = { tools: [], notes: [] };
  private listeners = new Set<() => void>();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): Snapshot => this.snapshot;

  private emit() {
    this.snapshot = { tools: this.tools, notes: this.notes };
    this.listeners.forEach((listener) => listener());
  }

  reset() {
    this.tools = [];
    this.notes = [];
    this.emit();
  }

  addNote(message: string) {
    this.notes = [
      ...this.notes,
      { id: crypto.randomUUID(), message, timestamp: Date.now() },
    ];
    this.emit();
  }

  startTool(name: string, input: unknown): string {
    const id = crypto.randomUUID();
    this.tools = [
      ...this.tools,
      { id, name, input, status: "running", timestamp: Date.now() },
    ];
    this.emit();
    return id;
  }

  finishTool(id: string, result: unknown) {
    this.tools = this.tools.map((tool) =>
      tool.id === id ? { ...tool, result, status: "ok" as const } : tool,
    );
    this.emit();
  }

  failTool(id: string, error: string) {
    this.tools = this.tools.map((tool) =>
      tool.id === id ? { ...tool, error, status: "error" as const } : tool,
    );
    this.emit();
  }
}

export const activity = new ActivityStore();
