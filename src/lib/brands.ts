import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import type {
  Brand,
  BrandPlan,
  BrandSession,
  Product,
  ProductCategory,
  ProductVariant,
  WhiteLabelConfig,
} from "./types";
import { getDb } from "./db";

const DATA_DIR = path.join(process.cwd(), "data");
const BRANDS_FILE = path.join(DATA_DIR, "brands.json");

interface BrandDb {
  brands: Brand[];
  sessions: BrandSession[];
}

function defaultWhiteLabel(name: string, subdomain: string): WhiteLabelConfig {
  return {
    subdomain,
    customDomain: "",
    storeName: name,
    tagline: "Powered by LUMÉA Studio",
    primaryColor: "#1a1612",
    accentColor: "#c4a574",
    backgroundColor: "#faf7f2",
    logoUrl: "/icons/lumea-mark.svg",
    faviconUrl: "/icons/lumea-mark.svg",
    supportEmail: "",
    enabled: true,
  };
}

function seedBrands(): Brand[] {
  const now = new Date().toISOString();
  return [
    {
      id: "brand-lumea",
      slug: "lumea",
      name: "LUMÉA House",
      email: "brands@lumea.beauty",
      password: "lumea-demo",
      contactName: "LUMÉA Ops",
      website: "https://lumea.beauty",
      plan: "enterprise",
      status: "active",
      whiteLabel: defaultWhiteLabel("LUMÉA", "lumea"),
      productCount: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "brand-demo-glow",
      slug: "glowlab",
      name: "GlowLab Beauty",
      email: "partner@glowlab.demo",
      password: "glowlab-demo",
      contactName: "Ava Partner",
      website: "https://glowlab.demo",
      plan: "growth",
      status: "active",
      whiteLabel: {
        ...defaultWhiteLabel("GlowLab", "glowlab"),
        tagline: "Glow for every hour.",
        primaryColor: "#2a1f3d",
        accentColor: "#e8a0c8",
        backgroundColor: "#faf5f8",
        supportEmail: "hello@glowlab.demo",
      },
      productCount: 0,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

async function ensureBrandDb(): Promise<BrandDb> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(BRANDS_FILE, "utf-8");
    const db = JSON.parse(raw) as BrandDb;
    if (!db.brands?.length) throw new Error("empty");
    return db;
  } catch {
    const db: BrandDb = { brands: seedBrands(), sessions: [] };
    await fs.writeFile(BRANDS_FILE, JSON.stringify(db, null, 2));
    // Seed demo partner catalogue once
    await seedDemoPartnerProducts().catch(() => {});
    return db;
  }
}

async function seedDemoPartnerProducts() {
  const brandId = "brand-demo-glow";
  const existing = await listBrandProducts(brandId);
  if (existing.length > 0) return;
  const demos = [
    {
      name: "GlowLab Soft Blush",
      tagline: "Cheek light in a stick",
      category: "makeup" as const,
      price: 22,
      images: ["/images/product-gloss.jpg"],
      variants: [
        {
          id: "gl-blush-1",
          name: "Petal",
          sku: "GL-BLUSH-01",
          shadeHex: "#E8A0A8",
          price: 22,
          stock: 60,
        },
      ],
    },
    {
      name: "GlowLab Hair Silk Spray",
      tagline: "Heat shield shine",
      category: "hair" as const,
      price: 26,
      images: ["/images/product-hairoil.jpg"],
      variants: [
        {
          id: "gl-hair-1",
          name: "100ml",
          sku: "GL-HAIR-01",
          price: 26,
          stock: 45,
        },
      ],
    },
    {
      name: "GlowLab Contour Duo",
      tagline: "Sculpt + highlight",
      category: "makeup" as const,
      price: 38,
      images: ["/images/product-contour.jpg"],
      variants: [
        {
          id: "gl-ct-1",
          name: "Medium",
          sku: "GL-CT-01",
          shadeHex: "#A07850",
          price: 38,
          stock: 40,
        },
      ],
    },
  ];
  for (const d of demos) {
    await createBrandProduct(brandId, {
      ...d,
      description: `${d.name} — exclusive on the LUMÉA multi-tenant network.`,
      badges: ["new"],
      featured: true,
      active: true,
    });
  }
}

async function saveBrandDb(db: BrandDb) {
  await fs.writeFile(BRANDS_FILE, JSON.stringify(db, null, 2));
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export async function listBrands() {
  const db = await ensureBrandDb();
  return db.brands.map(publicBrand);
}

function publicBrand(b: Brand) {
  const { password: _, ...rest } = b;
  return rest;
}

export async function getBrandById(id: string) {
  const db = await ensureBrandDb();
  return db.brands.find((b) => b.id === id) ?? null;
}

export async function getBrandBySlug(slug: string) {
  const db = await ensureBrandDb();
  return (
    db.brands.find((b) => b.slug === slug || b.whiteLabel.subdomain === slug) ??
    null
  );
}

export async function getBrandByEmail(email: string) {
  const db = await ensureBrandDb();
  return (
    db.brands.find((b) => b.email.toLowerCase() === email.toLowerCase()) ?? null
  );
}

export async function getBrandByDomain(host: string) {
  const clean = host.toLowerCase().split(":")[0];
  const db = await ensureBrandDb();
  return (
    db.brands.find(
      (b) =>
        b.whiteLabel.enabled &&
        (b.whiteLabel.customDomain.toLowerCase() === clean ||
          clean.startsWith(`${b.whiteLabel.subdomain}.`))
    ) ?? null
  );
}

export async function registerBrand(input: {
  name: string;
  email: string;
  password: string;
  contactName: string;
  website?: string;
  plan?: BrandPlan;
}) {
  const db = await ensureBrandDb();
  const exists = db.brands.find(
    (b) => b.email.toLowerCase() === input.email.toLowerCase()
  );
  if (exists) throw new Error("Email already registered");

  let base = slugify(input.name) || "brand";
  let slug = base;
  let i = 1;
  while (db.brands.some((b) => b.slug === slug)) {
    slug = `${base}-${i++}`;
  }

  const now = new Date().toISOString();
  const brand: Brand = {
    id: nanoid(12),
    slug,
    name: input.name,
    email: input.email,
    password: input.password,
    contactName: input.contactName,
    website: input.website || "",
    plan: input.plan || "starter",
    status: "active",
    whiteLabel: defaultWhiteLabel(input.name, slug),
    productCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  db.brands.unshift(brand);
  await saveBrandDb(db);
  const session = await createSession(brand.id, brand.email);
  return { brand: publicBrand(brand), session };
}

export async function loginBrand(email: string, password: string) {
  const brand = await getBrandByEmail(email);
  if (!brand || brand.password !== password) {
    throw new Error("Invalid email or password");
  }
  if (brand.status === "suspended") throw new Error("Account suspended");
  const session = await createSession(brand.id, brand.email);
  return { brand: publicBrand(brand), session };
}

async function createSession(brandId: string, email: string) {
  const db = await ensureBrandDb();
  const session: BrandSession = {
    brandId,
    email,
    token: nanoid(32),
    createdAt: new Date().toISOString(),
  };
  db.sessions = db.sessions.filter((s) => s.brandId !== brandId);
  db.sessions.push(session);
  await saveBrandDb(db);
  return session;
}

export async function getSession(token: string | null | undefined) {
  if (!token) return null;
  const db = await ensureBrandDb();
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return null;
  const brand = db.brands.find((b) => b.id === session.brandId);
  if (!brand) return null;
  return { session, brand: publicBrand(brand) as Omit<Brand, "password"> & { password?: string }, full: brand };
}

export async function logoutBrand(token: string) {
  const db = await ensureBrandDb();
  db.sessions = db.sessions.filter((s) => s.token !== token);
  await saveBrandDb(db);
}

export async function updateBrand(
  brandId: string,
  patch: Partial<
    Pick<Brand, "name" | "contactName" | "website" | "plan" | "status">
  > & { whiteLabel?: Partial<WhiteLabelConfig> }
) {
  const db = await ensureBrandDb();
  const idx = db.brands.findIndex((b) => b.id === brandId);
  if (idx === -1) throw new Error("Brand not found");

  if (patch.whiteLabel?.subdomain) {
    const sub = slugify(patch.whiteLabel.subdomain);
    const clash = db.brands.find(
      (b) => b.id !== brandId && (b.slug === sub || b.whiteLabel.subdomain === sub)
    );
    if (clash) throw new Error("Subdomain already taken");
    patch.whiteLabel.subdomain = sub;
  }

  if (patch.whiteLabel?.customDomain) {
    const domain = patch.whiteLabel.customDomain.toLowerCase().trim();
    const clash = db.brands.find(
      (b) =>
        b.id !== brandId &&
        b.whiteLabel.customDomain &&
        b.whiteLabel.customDomain.toLowerCase() === domain
    );
    if (clash) throw new Error("Custom domain already in use");
    patch.whiteLabel.customDomain = domain;
  }

  db.brands[idx] = {
    ...db.brands[idx],
    ...patch,
    whiteLabel: patch.whiteLabel
      ? { ...db.brands[idx].whiteLabel, ...patch.whiteLabel }
      : db.brands[idx].whiteLabel,
    updatedAt: new Date().toISOString(),
  };
  await saveBrandDb(db);
  return publicBrand(db.brands[idx]);
}

export async function listBrandProducts(brandId: string) {
  const store = await getDb();
  return store.products.filter((p) => p.brandId === brandId);
}

export async function syncBrandProductCount(brandId: string) {
  const products = await listBrandProducts(brandId);
  const db = await ensureBrandDb();
  const idx = db.brands.findIndex((b) => b.id === brandId);
  if (idx === -1) return;
  db.brands[idx].productCount = products.length;
  db.brands[idx].updatedAt = new Date().toISOString();
  await saveBrandDb(db);
}

export async function createBrandProduct(
  brandId: string,
  input: Partial<Product> & { name: string }
): Promise<Product> {
  const { upsertProduct } = await import("./db");
  const product = await upsertProduct({
    ...input,
    brandId,
    name: input.name,
    active: input.active ?? true,
  });
  await syncBrandProductCount(brandId);
  return product;
}

/** Parse simple CSV (no nested quotes edge cases beyond double-quote pairs) */
export function parseCsv(text: string): Record<string, string>[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]).map((h) =>
    h.trim().toLowerCase().replace(/\s+/g, "_")
  );
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = (cols[i] ?? "").trim();
    });
    return row;
  });
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQ = !inQ;
    } else if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

const CATEGORIES: ProductCategory[] = [
  "makeup",
  "skin",
  "hair",
  "body",
  "sets",
  "tools",
];

export async function importBrandProductsFromCsv(
  brandId: string,
  csvText: string
) {
  const rows = parseCsv(csvText);
  if (!rows.length) throw new Error("CSV has no data rows");

  const created: Product[] = [];
  const errors: { row: number; error: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      const name = row.name || row.product_name || row.title;
      if (!name) throw new Error("Missing name");

      const price = Number(row.price || row.unit_price || 0);
      if (Number.isNaN(price)) throw new Error("Invalid price");

      const stock = Number(row.stock || row.inventory || row.qty || 50);
      const categoryRaw = (row.category || "makeup").toLowerCase();
      const category = CATEGORIES.includes(categoryRaw as ProductCategory)
        ? (categoryRaw as ProductCategory)
        : "makeup";

      const sku =
        row.sku || `BR-${nanoid(6).toUpperCase()}`;
      const variantName = row.variant || row.shade || row.size || "Default";
      const shadeHex = row.shade_hex || row.hex || undefined;

      const variant: ProductVariant = {
        id: nanoid(8),
        name: variantName,
        sku,
        shadeHex,
        price,
        stock: Number.isNaN(stock) ? 50 : stock,
      };

      const badges = (row.badges || row.badge || "")
        .split(/[|;]/)
        .map((b) => b.trim().toLowerCase())
        .filter(Boolean) as Product["badges"];

      const image =
        row.image || row.image_url || "/images/product-foundation.jpg";

      const product = await createBrandProduct(brandId, {
        name,
        slug: row.slug || undefined,
        tagline: row.tagline || row.subtitle || "",
        description: row.description || row.desc || "",
        category,
        price,
        images: [image],
        badges: badges.length ? badges : ["new"],
        variants: [variant],
        featured: row.featured === "true" || row.featured === "1",
        active: row.active !== "false" && row.active !== "0",
        howToUse: row.how_to_use || row.howto || undefined,
      });
      created.push(product);
    } catch (e) {
      errors.push({
        row: i + 2,
        error: e instanceof Error ? e.message : "Failed",
      });
    }
  }

  await syncBrandProductCount(brandId);
  return { created: created.length, products: created, errors };
}

export const CSV_TEMPLATE = `name,slug,category,tagline,description,price,stock,sku,variant,shade_hex,image,badges,featured,active
Velvet Blush Stick,velvet-blush-stick,makeup,Soft wash of colour,Buildable cream blush for all skin tones,24,80,GL-BLUSH-01,Rose,E8A0A8,/images/product-gloss.jpg,new|bestseller,true,true
Repair Hair Mist,repair-hair-mist,hair,Heat protect shine,Lightweight mist for all textures,22,60,GL-HAIR-02,50ml,,/images/product-hairoil.jpg,new,false,true
Body Glow Oil,body-glow-oil,body,Liquid light,Fast-absorb dry oil,36,40,GL-BODY-01,100ml,,/images/product-bodyoil.jpg,viral,true,true
Pro Contour Brush,pro-contour-brush,tools,Precision sculpt,Angled brush for contour,28,100,GL-TOOL-01,Single,,/images/product-brushes.jpg,,false,true
`;
