import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import type { SessionFormat, ExpertSpecialty } from "./concierge-experts";
import { getExpert, priceFor, splitFee } from "./concierge-experts";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "concierge.json");

export interface ExpertApplication {
  id: string;
  name: string;
  email: string;
  title: string;
  bio: string;
  specialties: ExpertSpecialty[];
  brandSlugs: string[];
  instagram?: string;
  yearsExp: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface ConciergeBooking {
  id: string;
  expertId: string;
  expertSlug: string;
  expertName: string;
  format: SessionFormat;
  durationMin: number;
  priceUsd: number;
  expertEarns: number;
  platformEarns: number;
  productCommissionPct: number;
  clientName: string;
  clientEmail: string;
  partySize: number;
  eventType?: string;
  notes: string;
  /** Live stream room code for 1:1 or group */
  roomCode: string;
  status: "requested" | "confirmed" | "live" | "completed" | "cancelled";
  createdAt: string;
}

interface Store {
  applications: ExpertApplication[];
  bookings: ConciergeBooking[];
}

async function read(): Promise<Store> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Store;
  } catch {
    return { applications: [], bookings: [] };
  }
}

async function write(s: Store) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(s, null, 2));
}

export async function applyAsExpert(input: {
  name: string;
  email: string;
  title: string;
  bio: string;
  specialties: ExpertSpecialty[];
  brandSlugs: string[];
  instagram?: string;
  yearsExp: number;
}) {
  const store = await read();
  const app: ExpertApplication = {
    id: nanoid(10),
    ...input,
    email: input.email.toLowerCase().trim(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  store.applications.unshift(app);
  store.applications = store.applications.slice(0, 200);
  await write(store);
  return app;
}

export async function listApplications() {
  return (await read()).applications;
}

export async function createBooking(input: {
  expertSlug: string;
  format: SessionFormat;
  clientName: string;
  clientEmail: string;
  partySize?: number;
  eventType?: string;
  notes?: string;
}) {
  const expert = getExpert(input.expertSlug);
  if (!expert || !expert.verified) throw new Error("Expert not available");

  const tier = priceFor(expert, input.format);
  if (!tier) throw new Error("Session format not offered");

  const partySize = Math.min(
    tier.maxClients,
    Math.max(1, input.partySize || 1)
  );
  if (partySize > tier.maxClients) {
    throw new Error(`Max ${tier.maxClients} clients for this format`);
  }

  const { expert: expertEarns, platform: platformEarns } = splitFee(
    tier.priceUsd,
    expert.platformShare
  );

  const store = await read();
  const booking: ConciergeBooking = {
    id: nanoid(12),
    expertId: expert.id,
    expertSlug: expert.slug,
    expertName: expert.name,
    format: input.format,
    durationMin: tier.durationMin,
    priceUsd: tier.priceUsd,
    expertEarns,
    platformEarns,
    productCommissionPct: expert.productCommissionPct,
    clientName: input.clientName,
    clientEmail: input.clientEmail.toLowerCase().trim(),
    partySize,
    eventType: input.eventType,
    notes: input.notes || "",
    roomCode: nanoid(8).toUpperCase(),
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  store.bookings.unshift(booking);
  store.bookings = store.bookings.slice(0, 500);
  await write(store);
  return booking;
}

export async function getBooking(id: string) {
  const store = await read();
  return store.bookings.find((b) => b.id === id) ?? null;
}

export async function listBookings(email?: string) {
  const store = await read();
  if (email) {
    return store.bookings.filter(
      (b) => b.clientEmail === email.toLowerCase().trim()
    );
  }
  return store.bookings;
}
