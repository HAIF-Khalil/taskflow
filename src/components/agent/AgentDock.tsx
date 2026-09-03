"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AgentActivity } from "@/components/AgentActivity";
import { useAgentDock } from "@/components/agent/AgentDockContext";
import { ApprovalModal } from "@/components/ApprovalModal";
import { BudgetCard } from "@/components/BudgetCard";
import { PlanTimeline } from "@/components/PlanTimeline";
import { PlanningStages } from "@/components/PlanningStages";
import { DEMO_PROMPT, SUGGESTED_PROMPTS } from "@/components/PromptBox";
import { WebMCPPanel } from "@/components/WebMCPPanel";
import { WhyThisPlan } from "@/components/WhyThisPlan";
import { Button } from "@/components/ui/button";
import { executePlan } from "@/lib/agent/executor";
import { runAgent, swapTasker } from "@/lib/agent/planner";
import { bumpTime } from "@/lib/mock-data/availability";
import { formatDuration, formatMoney } from "@/lib/format";
import { activity } from "@/lib/webmcp/activity";
import { resetToolCache } from "@/lib/webmcp/client";
import type { AppState, Plan, PlanTask } from "@/types";
import { ArrowRight, Terminal, X } from "lucide-react";

export function AgentDock() {
  const { open, setOpen } = useAgentDock();
  const [state, setState] = useState<AppState>("idle");
  const [prompt, setPrompt] = useState(DEMO_PROMPT);
  const [stage, setStage] = useState(0);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [showWebmcp, setShowWebmcp] = useState(true);
  const [busy, setBusy] = useState(false);

  const totals = useMemo(() => {
    if (!plan) return { total: 0, hours: 0 };
    return {
      total: plan.tasks.reduce((sum, task) => sum + task.price, 0),
      hours: plan.tasks.reduce((sum, task) => sum + task.durationHours, 0),
    };
  }, [plan]);

  function resetAgent() {
    activity.reset();
    resetToolCache();
    setPlan(null);
    setStage(0);
    setBusy(false);
    setState("idle");
    setPrompt(DEMO_PROMPT);
  }

  async function handleBuild() {
    if (!prompt.trim() || busy) return;
    activity.reset();
    resetToolCache();
    setPlan(null);
    setStage(0);
    setState("analyzing");
    setBusy(true);
    try {
      const nextPlan = await runAgent(prompt, (index) => {
        setStage(index);
        setState(index <= 1 ? "analyzing" : "planning");
      });
      setPlan(nextPlan);
      setState("plan-ready");
    } finally {
      setBusy(false);
    }
  }

  async function handleChangeTasker(task: PlanTask) {
    if (!plan) return;
    setBusy(true);
    try {
      const updated = await swapTasker(task);
      setPlan({
        ...plan,
        tasks: plan.tasks.map((item) => (item.id === task.id ? updated : item)),
      });
    } finally {
      setBusy(false);
    }
  }

  function handleChangeTime(task: PlanTask) {
    if (!plan) return;
    setPlan({
      ...plan,
      tasks: plan.tasks.map((item) =>
        item.id === task.id ? { ...item, time: bumpTime(item.time) } : item,
      ),
    });
  }

  async function handleConfirm() {
    if (!plan) return;
    setState("executing");
    setBusy(true);
    try {
      const scheduled = await executePlan(plan);
      setPlan(scheduled);
      setState("completed");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  const working = state === "analyzing" || state === "planning";
  const side = showWebmcp ? <WebMCPPanel /> : <AgentActivity />;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        aria-label="Close agent"
        className="absolute inset-0 bg-zinc-950/40"
        onClick={() => setOpen(false)}
      />
      <aside className="dark relative flex h-full w-full max-w-xl flex-col bg-zinc-950 text-zinc-50 shadow-2xl">
        <header className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <div>
            <p className="text-[11px] font-medium tracking-[0.16em] text-amber-200/80 uppercase">
              In-page agent
            </p>
            <p className="text-sm font-medium">Uses this site’s WebMCP tools</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant={showWebmcp ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowWebmcp((value) => !value)}
              className="h-8 text-xs"
            >
              <Terminal className="size-3.5" />
              WebMCP
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {state === "idle" && (
            <div>
              <h2 className="font-heading text-2xl tracking-tight">
                What outcome do you want?
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                The marketplace stays open. This agent will call document.modelContext
                tools — the same search and booking path humans use in the UI.
              </p>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={4}
                className="mt-4 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm leading-relaxed outline-none"
              />
              <Button
                type="button"
                onClick={() => void handleBuild()}
                disabled={!prompt.trim() || busy}
                className="mt-3 h-10 w-full gap-2 rounded-xl bg-amber-400 text-zinc-950 hover:bg-amber-300"
              >
                Build my plan
                <ArrowRight className="size-4" />
              </Button>
              <div className="mt-4 flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setPrompt(item.value)}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400 hover:text-zinc-100"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {working && (
            <div className="space-y-6">
              <PlanningStages current={stage} />
              <div className="min-h-64">{side}</div>
            </div>
          )}

          {state === "plan-ready" && plan && (
            <div className="space-y-4">
              <div>
                <h2 className="font-heading text-2xl tracking-tight">{plan.title}</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {plan.tasks.length} tasks · {formatDuration(totals.hours)} ·{" "}
                  {formatMoney(totals.total)} total
                </p>
              </div>
              <PlanTimeline
                plan={plan}
                interactive
                onChangeTasker={(task) => void handleChangeTasker(task)}
                onChangeTime={handleChangeTime}
              />
              <BudgetCard plan={plan} />
              <WhyThisPlan plan={plan} />
              {showWebmcp && <WebMCPPanel />}
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  className="h-10 bg-amber-400 text-zinc-950 hover:bg-amber-300"
                  onClick={() => setState("approval")}
                >
                  Approve & Schedule
                </Button>
                <Button type="button" variant="ghost" onClick={resetAgent}>
                  Start over
                </Button>
              </div>
            </div>
          )}

          {state === "executing" && (
            <div className="space-y-4">
              <h2 className="font-heading text-2xl tracking-tight">
                Sending requests through WebMCP
              </h2>
              <p className="text-sm text-zinc-400">
                createTaskRequest() and scheduleTask() — the same functions the Request
                button uses.
              </p>
              {side}
            </div>
          )}

          {state === "completed" && plan && (
            <div className="space-y-4">
              <h2 className="font-heading text-2xl tracking-tight">You&apos;re all set.</h2>
              <p className="text-sm text-zinc-400">
                The agent booked {plan.tasks.length} tasks. They now appear in My Tasks
                next to anything you booked yourself.
              </p>
              <PlanTimeline plan={plan} />
              {showWebmcp && <WebMCPPanel />}
              <div className="flex flex-col gap-2">
                <Button asChild className="h-10 bg-amber-400 text-zinc-950 hover:bg-amber-300">
                  <Link href="/tasks" onClick={() => setOpen(false)}>
                    View My Tasks
                  </Link>
                </Button>
                <Button type="button" variant="ghost" onClick={resetAgent}>
                  Ask another goal
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {plan && state === "approval" && (
        <ApprovalModal
          plan={plan}
          open
          onCancel={() => setState("plan-ready")}
          onConfirm={() => void handleConfirm()}
        />
      )}
    </div>
  );
}
