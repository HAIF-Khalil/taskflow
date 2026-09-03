"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type AgentDockContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AgentDockContext = createContext<AgentDockContextValue | null>(null);

export function AgentDockProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return (
    <AgentDockContext.Provider value={value}>{children}</AgentDockContext.Provider>
  );
}

export function useAgentDock() {
  const ctx = useContext(AgentDockContext);
  if (!ctx) throw new Error("useAgentDock must be used within AgentDockProvider");
  return ctx;
}
