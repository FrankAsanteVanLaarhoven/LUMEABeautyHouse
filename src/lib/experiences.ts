/** Live experiences — concierge + live shopping (Harrods × NAP style) */

export type ConciergeTopic =
  | "shade-match"
  | "full-face"
  | "hair-ritual"
  | "bridal"
  | "gift"
  | "brand-edit";

export interface ConciergeSlot {
  id: string;
  label: string;
  /** ISO-ish display */
  when: string;
  durationMin: number;
  artist: string;
  topics: ConciergeTopic[];
  seatsLeft: number;
}

export interface LiveEvent {
  id: string;
  title: string;
  subtitle: string;
  host: string;
  guestBrand?: string;
  guestBrandSlug?: string;
  when: string;
  durationMin: number;
  status: "upcoming" | "live" | "replay";
  image: string;
  /** Optional YouTube embed id for replay/live */
  youtubeId?: string;
  productSlugs: string[];
  description: string;
}

export const CONCIERGE_SLOTS: ConciergeSlot[] = [
  {
    id: "c1",
    label: "Tomorrow · 10:00",
    when: "Tomorrow 10:00",
    durationMin: 20,
    artist: "Amara · Deep & rich specialist",
    topics: ["shade-match", "full-face"],
    seatsLeft: 3,
  },
  {
    id: "c2",
    label: "Tomorrow · 14:30",
    when: "Tomorrow 14:30",
    durationMin: 20,
    artist: "Priya · Glass skin & undertones",
    topics: ["shade-match", "hair-ritual"],
    seatsLeft: 2,
  },
  {
    id: "c3",
    label: "Fri · 11:00",
    when: "Friday 11:00",
    durationMin: 30,
    artist: "Valentina · Soft glam",
    topics: ["full-face", "bridal", "gift"],
    seatsLeft: 4,
  },
  {
    id: "c4",
    label: "Sat · 16:00",
    when: "Saturday 16:00",
    durationMin: 25,
    artist: "Keisha · Coils & 4C",
    topics: ["hair-ritual", "brand-edit"],
    seatsLeft: 2,
  },
  {
    id: "c5",
    label: "Sun · 12:00",
    when: "Sunday 12:00",
    durationMin: 20,
    artist: "House desk · Any concern",
    topics: ["shade-match", "gift", "full-face"],
    seatsLeft: 5,
  },
];

export const LIVE_EVENTS: LiveEvent[] = [
  {
    id: "live-house-of-light",
    title: "House of Light Live",
    subtitle: "Multi-brand shade drop with host + guest floor",
    host: "LUMÉA Atelier",
    guestBrand: "Casa Luz",
    guestBrandSlug: "casa-luz",
    when: "This Thursday · 19:00",
    durationMin: 45,
    status: "upcoming",
    image: "/images/campaign-latina.jpg",
    youtubeId: "jfKfPfyJRdk",
    productSlugs: [
      "veil-soft-focus-foundation",
      "sun-sculpt-creme-bronzer",
      "lume-glass-lip-oil",
      "glow-edit-full-face-set",
    ],
    description:
      "A weekly live room: real-time shade matching, soft glam demos, and exclusive first access to floor pieces. Chat, shop, and book a follow-up concierge slot.",
  },
  {
    id: "live-coil-night",
    title: "Coil Atelier Night",
    subtitle: "Wash day → defined · pattern-first ritual",
    host: "Keisha M.",
    guestBrand: "Coil Atelier",
    guestBrandSlug: "coil-atelier",
    when: "Saturday · 15:00",
    durationMin: 40,
    status: "upcoming",
    image: "/images/campaign-hair.jpg",
    youtubeId: "jfKfPfyJRdk",
    productSlugs: [
      "coil-define-curl-cream",
      "repair-cloud-hair-mask",
      "flux-9-in-1-hair-oil",
      "hair-ritual-cleanse-treat-set",
    ],
    description:
      "Definition without crunch. Live wash-day order, product layering, and Q&A for 3B–4C. Shop the floor while we demo.",
  },
  {
    id: "live-veil-replay",
    title: "Veil Masterclass (Replay)",
    subtitle: "Fifty undertones · no ash · camera true",
    host: "Amara K.",
    guestBrand: "LUMÉA",
    guestBrandSlug: "lumea",
    when: "On demand",
    durationMin: 35,
    status: "replay",
    image: "/images/campaign-deep.jpg",
    youtubeId: "jfKfPfyJRdk",
    productSlugs: [
      "veil-soft-focus-foundation",
      "edge-sculpt-contour-palette",
      "cloud-bounce-beauty-sponge",
    ],
    description:
      "Watch the full Veil application for deep and rich depths. Jump to shoppable moments and re-book a private shade session.",
  },
];

export function getLiveEvent(id: string) {
  return LIVE_EVENTS.find((e) => e.id === id);
}

export function getConciergeSlot(id: string) {
  return CONCIERGE_SLOTS.find((s) => s.id === id);
}

export const TOPIC_LABELS: Record<ConciergeTopic, string> = {
  "shade-match": "Shade match",
  "full-face": "Full face edit",
  "hair-ritual": "Hair ritual",
  bridal: "Bridal / event",
  gift: "Gift concierge",
  "brand-edit": "Brand floor edit",
};
