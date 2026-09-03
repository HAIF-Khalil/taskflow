import { cn } from "@/lib/utils";

function hueFromName(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(hash) % 360;
}

export function InitialsAvatar({
  name,
  initials,
  size = "md",
}: {
  name: string;
  initials: string;
  size?: "sm" | "md" | "lg";
}) {
  const hue = hueFromName(name);
  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-medium tracking-tight",
        size === "sm" && "size-8 text-xs",
        size === "md" && "size-10 text-sm",
        size === "lg" && "size-12 text-base",
      )}
      style={{
        background: `oklch(0.32 0.07 ${hue})`,
        color: `oklch(0.93 0.04 ${hue})`,
      }}
    >
      {initials}
    </div>
  );
}
