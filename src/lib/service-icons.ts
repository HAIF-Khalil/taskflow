import {
  Armchair,
  Bolt,
  Droplets,
  Hammer,
  Monitor,
  Package,
  Sparkles,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  "furniture-assembly": Armchair,
  "home-cleaning": Sparkles,
  "tv-mounting": Monitor,
  "moving-help": Truck,
  handyman: Hammer,
  plumbing: Droplets,
  electrical: Bolt,
  "yard-work": Sparkles,
  delivery: Package,
  "packing-unpacking": Package,
};

export function serviceIcon(slug: string): LucideIcon {
  return SERVICE_ICONS[slug] ?? Wrench;
}
