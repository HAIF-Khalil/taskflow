"use client";

import { useAgentDock } from "@/components/agent/AgentDockContext";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function AskAgentButton({
  label = "Ask an agent",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const { setOpen } = useAgentDock();
  return (
    <Button
      type="button"
      onClick={() => setOpen(true)}
      className={className ?? "h-10 rounded-full bg-white px-5 text-emerald-800 hover:bg-emerald-50"}
    >
      <Sparkles className="size-4" />
      {label}
    </Button>
  );
}
