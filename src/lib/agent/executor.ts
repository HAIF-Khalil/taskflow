import { callTool } from "@/lib/webmcp/client";
import { activity } from "@/lib/webmcp/activity";
import type { Plan, PlanTask } from "@/types";

type RequestResult = { requestId: string };
type ScheduleResult = { bookingId: string; status: string };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function executePlan(plan: Plan): Promise<Plan> {
  activity.addNote("Executing your plan through WebMCP...");
  const scheduled: PlanTask[] = [];

  for (const task of plan.tasks) {
    activity.addNote(`Creating request for ${task.serviceName}...`);
    const request = await callTool<RequestResult>("createTaskRequest", {
      service: task.serviceId,
      taskerId: task.tasker.id,
      description: task.description,
      price: task.price,
    });
    await sleep(180);

    activity.addNote(`Scheduling ${task.tasker.name} at ${task.time}...`);
    await callTool<ScheduleResult>("scheduleTask", {
      requestId: request.requestId,
      date: task.dateLabel,
      time: task.time,
    });
    scheduled.push({ ...task, status: "scheduled" });
    await sleep(160);
  }

  activity.addNote("Plan confirmed.");
  return { ...plan, tasks: scheduled };
}
