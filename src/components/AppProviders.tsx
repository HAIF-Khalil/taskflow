"use client";

import { useEffect } from "react";
import { AgentDock } from "@/components/agent/AgentDock";
import { AgentDockProvider } from "@/components/agent/AgentDockContext";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { registerMarketplaceTools } from "@/lib/webmcp/register-tools";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void registerMarketplaceTools();
  }, []);

  return (
    <AgentDockProvider>
      <div className="flex min-h-full flex-col bg-[#f7f7f4] text-zinc-950">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
      <AgentDock />
    </AgentDockProvider>
  );
}
