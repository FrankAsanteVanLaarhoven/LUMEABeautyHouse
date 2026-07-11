import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "abandons.json");

export interface AbandonCartItem {
  productId: string;
  variantId: string;
  slug?: string;
  name: string;
  variantName: string;
  sku: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
}

export interface AbandonRecord {
  id: string;
  token: string;
  email: string;
  items: AbandonCartItem[];
  cartValue: number;
  recovered: boolean;
  createdAt: string;
  expiresAt: string;
}

interface FileShape {
  records: AbandonRecord[];
}

async function read(): Promise<FileShape> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as FileShape;
  } catch {
    return { records: [] };
  }
}

async function write(data: FileShape) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2));
}

export async function createAbandon(input: {
  email: string;
  items: AbandonCartItem[];
  cartValue: number;
}): Promise<AbandonRecord> {
  const data = await read();
  const now = Date.now();
  const rec: AbandonRecord = {
    id: nanoid(10),
    token: nanoid(24),
    email: input.email.trim().toLowerCase(),
    items: input.items,
    cartValue: input.cartValue,
    recovered: false,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
  data.records.unshift(rec);
  data.records = data.records.slice(0, 300);
  await write(data);
  return rec;
}

export async function getAbandonByToken(token: string) {
  const data = await read();
  const rec = data.records.find((r) => r.token === token);
  if (!rec) return null;
  if (new Date(rec.expiresAt).getTime() < Date.now()) return null;
  return rec;
}

export async function markRecovered(token: string) {
  const data = await read();
  const idx = data.records.findIndex((r) => r.token === token);
  if (idx === -1) return null;
  data.records[idx].recovered = true;
  await write(data);
  return data.records[idx];
}
