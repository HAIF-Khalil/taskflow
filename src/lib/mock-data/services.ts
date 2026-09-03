import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "svc-furniture-assembly",
    name: "Furniture Assembly",
    slug: "furniture-assembly",
    description: "Assemble beds, desks, shelves, and flat-pack furniture.",
    typicalDurationHours: 2,
    keywords: ["furniture", "ikea", "assemble", "bed", "desk", "move-in", "apartment", "home"],
  },
  {
    id: "svc-home-cleaning",
    name: "Home Cleaning",
    slug: "home-cleaning",
    description: "Apartment and home cleaning, including move-in deep cleans.",
    typicalDurationHours: 2,
    keywords: ["clean", "cleaning", "apartment", "move-in", "party", "home"],
  },
  {
    id: "svc-tv-mounting",
    name: "TV Mounting",
    slug: "tv-mounting",
    description: "Mount TVs safely on walls with tidy cable management.",
    typicalDurationHours: 1,
    keywords: ["tv", "mount", "wall", "apartment", "home", "move-in"],
  },
  {
    id: "svc-moving-help",
    name: "Moving Help",
    slug: "moving-help",
    description: "Heavy lifting, loading, and moving furniture between spaces.",
    typicalDurationHours: 3,
    keywords: ["move", "moving", "weekend", "boxes", "truck"],
  },
  {
    id: "svc-handyman",
    name: "Handyman",
    slug: "handyman",
    description: "General repairs, hanging, patching, and small installs.",
    typicalDurationHours: 2,
    keywords: ["fix", "repair", "handyman", "party", "home", "everything"],
  },
  {
    id: "svc-plumbing",
    name: "Plumbing",
    slug: "plumbing",
    description: "Faucets, leaks, toilets, and basic plumbing fixes.",
    typicalDurationHours: 1.5,
    keywords: ["plumb", "leak", "sink", "fix", "everything"],
  },
  {
    id: "svc-electrical",
    name: "Electrical",
    slug: "electrical",
    description: "Fixtures, outlets, and safe electrical repairs.",
    typicalDurationHours: 1.5,
    keywords: ["electric", "outlet", "light", "fix", "everything"],
  },
  {
    id: "svc-yard-work",
    name: "Yard Work",
    slug: "yard-work",
    description: "Lawn care, garden cleanup, and outdoor tidy-up.",
    typicalDurationHours: 2,
    keywords: ["yard", "lawn", "garden", "outdoor"],
  },
  {
    id: "svc-delivery",
    name: "Delivery",
    slug: "delivery",
    description: "Same-day pickup and delivery for supplies and party items.",
    typicalDurationHours: 1,
    keywords: ["deliver", "party", "supplies", "pickup"],
  },
  {
    id: "svc-packing",
    name: "Packing & Unpacking",
    slug: "packing-unpacking",
    description: "Pack, label, and unpack boxes for a move.",
    typicalDurationHours: 2.5,
    keywords: ["pack", "unpack", "boxes", "moving", "weekend"],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
