export function formatDuration(hours: number) {
  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  if (whole && minutes) return `${whole}h ${minutes}m`;
  if (whole) return whole === 1 ? "1 hour" : `${whole} hours`;
  return `${minutes}m`;
}

export function formatMoney(amount: number) {
  return `$${amount}`;
}

export function formatClock(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function summarizeResult(result: unknown) {
  if (result && typeof result === "object") {
    if ("count" in result && typeof result.count === "number") {
      return `${result.count} results`;
    }
    if ("amount" in result && typeof result.amount === "number") {
      return `$${result.amount}`;
    }
    if ("status" in result && typeof result.status === "string") {
      return result.status;
    }
    if ("slots" in result && Array.isArray(result.slots)) {
      return `${result.slots.length} windows`;
    }
  }
  return "ok";
}
