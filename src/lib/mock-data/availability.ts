import { getTaskerById } from "./taskers";
import type { AvailabilitySlot } from "@/types";

export function formatSlotLabel(slot: AvailabilitySlot) {
  const date =
    slot.date === "today"
      ? "Today"
      : slot.date === "tomorrow"
        ? "Tomorrow"
        : slot.date === "saturday"
          ? "Saturday"
          : slot.date === "sunday"
            ? "Sunday"
            : slot.date;
  return `${date} · ${toDisplayTime(slot.start)}`;
}

export function toDisplayTime(hhmm: string) {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function bumpTime(displayTime: string, minutes = 30) {
  const match = displayTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return displayTime;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  const total = hours * 60 + Number(match[2]) + minutes;
  const next = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(next / 60);
  const m = next % 60;
  return toDisplayTime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
}

export function getAvailabilityForTasker(taskerId: string, date?: string) {
  const tasker = getTaskerById(taskerId);
  if (!tasker) return [];
  return date
    ? tasker.availability.filter((slot) => slot.date === date)
    : tasker.availability;
}
