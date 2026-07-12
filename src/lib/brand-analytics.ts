import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "brand-analytics.json");

export type AnalyticsEventType =
  | "floor_view"
  | "product_view"
  | "add_to_bag"
  | "try_on_open"
  | "quiz_complete"
  | "live_rsvp"
  | "concierge_book";

export interface AnalyticsEvent {
  id: string;
  brandSlug: string;
  type: AnalyticsEventType;
  productSlug?: string;
  meta?: string;
  at: string;
}

interface Store {
  events: AnalyticsEvent[];
}

async function read(): Promise<Store> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Store;
  } catch {
    return { events: [] };
  }
}

async function write(s: Store) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(s, null, 2));
}

export async function trackEvent(input: {
  brandSlug: string;
  type: AnalyticsEventType;
  productSlug?: string;
  meta?: string;
}) {
  const store = await read();
  const ev: AnalyticsEvent = {
    id: nanoid(10),
    brandSlug: input.brandSlug,
    type: input.type,
    productSlug: input.productSlug,
    meta: input.meta,
    at: new Date().toISOString(),
  };
  store.events.unshift(ev);
  store.events = store.events.slice(0, 2000);
  await write(store);
  return ev;
}

export async function summaryForBrand(brandSlug: string) {
  const store = await read();
  const events = store.events.filter((e) => e.brandSlug === brandSlug);
  const count = (t: AnalyticsEventType) =>
    events.filter((e) => e.type === t).length;
  const productHits: Record<string, number> = {};
  for (const e of events) {
    if (e.productSlug) {
      productHits[e.productSlug] = (productHits[e.productSlug] || 0) + 1;
    }
  }
  const topProducts = Object.entries(productHits)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([slug, n]) => ({ slug, n }));

  return {
    brandSlug,
    total: events.length,
    floorViews: count("floor_view"),
    productViews: count("product_view"),
    addToBag: count("add_to_bag"),
    tryOnOpens: count("try_on_open"),
    quizComplete: count("quiz_complete"),
    liveRsvp: count("live_rsvp"),
    conciergeBook: count("concierge_book"),
    topProducts,
    recent: events.slice(0, 20),
  };
}

export async function platformSummary() {
  const store = await read();
  const byBrand: Record<string, number> = {};
  for (const e of store.events) {
    byBrand[e.brandSlug] = (byBrand[e.brandSlug] || 0) + 1;
  }
  return {
    totalEvents: store.events.length,
    brands: Object.entries(byBrand)
      .sort((a, b) => b[1] - a[1])
      .map(([slug, n]) => ({ slug, n })),
  };
}
