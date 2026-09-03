export type AppState =
  | "idle"
  | "analyzing"
  | "planning"
  | "plan-ready"
  | "approval"
  | "executing"
  | "completed";

export type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  typicalDurationHours: number;
  keywords: string[];
};

export type AvailabilitySlot = {
  date: string;
  start: string;
  end: string;
};

export type Tasker = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  completedTasks: number;
  hourlyRate: number;
  services: string[];
  distance: number;
  availability: AvailabilitySlot[];
  bio: string;
};

export type PlanTask = {
  id: string;
  serviceId: string;
  serviceName: string;
  description: string;
  tasker: Tasker;
  price: number;
  durationHours: number;
  dateLabel: string;
  time: string;
  distance: number;
  reason: string;
  status: "proposed" | "scheduled";
};

export type Plan = {
  title: string;
  headline: string;
  budget: number;
  tasks: PlanTask[];
  summary: string;
};

export type PlanningStage = {
  id: string;
  label: string;
};

export const PLANNING_STAGES: PlanningStage[] = [
  { id: "understand", label: "Understanding your goal" },
  { id: "break", label: "Breaking it into tasks" },
  { id: "find", label: "Finding available Taskers" },
  { id: "compare", label: "Comparing price & availability" },
  { id: "optimize", label: "Optimizing your schedule" },
  { id: "build", label: "Building your plan" },
];
