import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "leads.json");

export interface RestockLead {
  id: string;
  type: "restock";
  email: string;
  productSlug: string;
  productName: string;
  variantId?: string;
  createdAt: string;
}

export interface AbandonLead {
  id: string;
  type: "abandon";
  email: string;
  cartValue: number;
  itemCount: number;
  createdAt: string;
}

export interface SubscribeLead {
  id: string;
  type: "subscribe" | "newsletter";
  email: string;
  productSlug?: string;
  intervalDays?: number;
  createdAt: string;
}

export type Lead = RestockLead | AbandonLead | SubscribeLead;

interface LeadFile {
  leads: Lead[];
}

async function ensure() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, JSON.stringify({ leads: [] }, null, 2));
  }
}

async function read(): Promise<LeadFile> {
  await ensure();
  const raw = await fs.readFile(FILE, "utf8");
  try {
    return JSON.parse(raw) as LeadFile;
  } catch {
    return { leads: [] };
  }
}

async function write(data: LeadFile) {
  await ensure();
  await fs.writeFile(FILE, JSON.stringify(data, null, 2));
}

function id() {
  return `ld-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function addLead(
  lead: Omit<RestockLead, "id" | "createdAt"> | Omit<AbandonLead, "id" | "createdAt"> | Omit<SubscribeLead, "id" | "createdAt">
): Promise<Lead> {
  const data = await read();
  const full = {
    ...lead,
    id: id(),
    createdAt: new Date().toISOString(),
  } as Lead;
  data.leads.unshift(full);
  data.leads = data.leads.slice(0, 500);
  await write(data);
  return full;
}

export async function listLeads(): Promise<Lead[]> {
  return (await read()).leads;
}
