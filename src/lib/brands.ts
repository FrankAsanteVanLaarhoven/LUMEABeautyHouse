import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import type {
  Brand,
  BrandMember,
  BrandPlan,
  BrandSession,
  Product,
  ProductCategory,
  ProductVariant,
  StudioSkinConfig,
  TeamRole,
  WhiteLabelConfig,
} from "./types";
import { getDb } from "./db";
import { PLAN_SEAT_LIMITS } from "./rbac";

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

export function defaultStudioSkin(
  name: string,
  wl?: Partial<WhiteLabelConfig>
): StudioSkinConfig {
  return {
    enabled: true,
    studioName: `${name} Mirror Studio`,
    headline: "Try on in your light",
    subheadline:
      "Front-facing mirror camera with brand-true colour — play before you buy.",
    defaultLook: "brand",
    frameColor: wl?.backgroundColor || "#f4f4f2",
    ringLightColor: "#ffffff",
    panelColor: wl?.backgroundColor || "#faf7f2",
    textColor: wl?.primaryColor || "#1a1612",
    accentColor: wl?.accentColor || "#c4a574",
    buttonColor: wl?.primaryColor || "#1a1612",
    buttonTextColor: "#faf7f2",
    logoUrl: wl?.logoUrl || "/icons/lumea-mark.svg",
    watermark: name,
    showPoweredBy: true,
    defaultBrightness: 1.12,
    defaultIntensity: 0.42,
  };
}

function makeOwnerMember(
  brandId: string,
  email: string,
  name: string,
  password: string
): BrandMember {
  const now = new Date().toISOString();
  return {
    id: `owner-${brandId}`,
    brandId,
    email,
    name,
    password,
    role: "owner",
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
}

function migrateBrand(b: Brand): Brand {
  const plan = b.plan || "starter";
  const seatLimit = b.seatLimit || PLAN_SEAT_LIMITS[plan];
  const whiteLabel = b.whiteLabel || defaultWhiteLabel(b.name, b.slug);
  const studioSkin =
    b.studioSkin || defaultStudioSkin(b.name, whiteLabel);
  let members = Array.isArray(b.members) ? b.members : [];
  if (!members.some((m) => m.role === "owner")) {
    members = [
      makeOwnerMember(b.id, b.email, b.contactName || b.name, b.password),
      ...members,
    ];
  }
  return {
    ...b,
    whiteLabel,
    studioSkin,
    seatLimit,
    members,
  };
}

function seedBrands(): Brand[] {
  const now = new Date().toISOString();
  const lumeaWl = defaultWhiteLabel("LUMÉA", "lumea");
  const glowWl: WhiteLabelConfig = {
    ...defaultWhiteLabel("GlowLab", "glowlab"),
    tagline: "Glow for every hour.",
    primaryColor: "#2a1f3d",
    accentColor: "#e8a0c8",
    backgroundColor: "#faf5f8",
    supportEmail: "hello@glowlab.demo",
  };

  const lumea: Brand = {
    id: "brand-lumea",
    slug: "lumea",
    name: "LUMÉA House",
    email: "brands@lumea.beauty",
    password: "lumea-demo",
    contactName: "LUMÉA Ops",
    website: "https://lumea.beauty",
    plan: "enterprise",
    status: "active",
    whiteLabel: lumeaWl,
    studioSkin: defaultStudioSkin("LUMÉA", lumeaWl),
    seatLimit: PLAN_SEAT_LIMITS.enterprise,
    members: [
      makeOwnerMember(
        "brand-lumea",
        "brands@lumea.beauty",
        "LUMÉA Ops",
        "lumea-demo"
      ),
    ],
    productCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const glowOwner = makeOwnerMember(
    "brand-demo-glow",
    "partner@glowlab.demo",
    "Ava Partner",
    "glowlab-demo"
  );
  const glowEditor: BrandMember = {
    id: "member-glow-editor",
    brandId: "brand-demo-glow",
    email: "editor@glowlab.demo",
    name: "Sam Editor",
    password: "editor-demo",
    role: "editor",
    status: "active",
    invitedBy: glowOwner.id,
    createdAt: now,
    updatedAt: now,
  };
  const glowViewer: BrandMember = {
    id: "member-glow-viewer",
    brandId: "brand-demo-glow",
    email: "viewer@glowlab.demo",
    name: "Rio Viewer",
    password: "viewer-demo",
    role: "viewer",
    status: "active",
    invitedBy: glowOwner.id,
    createdAt: now,
    updatedAt: now,
  };

  const glow: Brand = {
    id: "brand-demo-glow",
    slug: "glowlab",
    name: "GlowLab Beauty",
    email: "partner@glowlab.demo",
    password: "glowlab-demo",
    contactName: "Ava Partner",
    website: "https://glowlab.demo",
    plan: "growth",
    status: "active",
    whiteLabel: glowWl,
    studioSkin: {
      ...defaultStudioSkin("GlowLab", glowWl),
      studioName: "GlowLab Mirror Studio",
      headline: "Glow in real light",
      subheadline:
        "Brand-skinned try-on — pink vanity accents, true colour for every undertone.",
      defaultLook: "brand",
      frameColor: "#faf5f8",
      ringLightColor: "#ffe8f4",
      panelColor: "#faf5f8",
      textColor: "#2a1f3d",
      accentColor: "#e8a0c8",
      buttonColor: "#2a1f3d",
      buttonTextColor: "#faf5f8",
      watermark: "GlowLab",
    },
    seatLimit: PLAN_SEAT_LIMITS.growth,
    members: [glowOwner, glowEditor, glowViewer],
    productCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  return [lumea, glow];
}

async function ensureBrandDb(): Promise<BrandDb> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(BRANDS_FILE, "utf-8");
    const db = JSON.parse(raw) as BrandDb;
    if (!db.brands?.length) throw new Error("empty");
    let dirty = false;
    db.brands = db.brands.map((b) => {
      const m = migrateBrand(b as Brand);
      if (
        !b.studioSkin ||
        !Array.isArray(b.members) ||
        !b.seatLimit
      ) {
        dirty = true;
      }
      return m;
    });
    // Ensure demo team seats exist on glowlab after migration of old files
    const glow = db.brands.find((b) => b.id === "brand-demo-glow");
    if (glow && glow.members.length < 2) {
      const now = new Date().toISOString();
      if (!glow.members.some((m) => m.email === "editor@glowlab.demo")) {
        glow.members.push({
          id: "member-glow-editor",
          brandId: glow.id,
          email: "editor@glowlab.demo",
          name: "Sam Editor",
          password: "editor-demo",
          role: "editor",
          status: "active",
          createdAt: now,
          updatedAt: now,
        });
        dirty = true;
      }
      if (!glow.members.some((m) => m.email === "viewer@glowlab.demo")) {
        glow.members.push({
          id: "member-glow-viewer",
          brandId: glow.id,
          email: "viewer@glowlab.demo",
          name: "Rio Viewer",
          password: "viewer-demo",
          role: "viewer",
          status: "active",
          createdAt: now,
          updatedAt: now,
        });
        dirty = true;
      }
      if (!glow.studioSkin || glow.studioSkin.studioName.includes("LUMÉA")) {
        glow.studioSkin = {
          ...defaultStudioSkin("GlowLab", glow.whiteLabel),
          studioName: "GlowLab Mirror Studio",
          headline: "Glow in real light",
          accentColor: "#e8a0c8",
          textColor: "#2a1f3d",
          buttonColor: "#2a1f3d",
          frameColor: "#faf5f8",
          panelColor: "#faf5f8",
        };
        dirty = true;
      }
    }
    if (dirty) await saveBrandDb(db);
    return db;
  } catch {
    const db: BrandDb = { brands: seedBrands(), sessions: [] };
    await fs.writeFile(BRANDS_FILE, JSON.stringify(db, null, 2));
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

function publicMember(m: BrandMember) {
  const { password: _, ...rest } = m;
  return rest;
}

function publicBrand(b: Brand) {
  const { password: _, members, ...rest } = b;
  return {
    ...rest,
    members: (members || []).map(publicMember),
    seatsUsed: (members || []).filter((m) => m.status !== "disabled").length,
  };
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
  const plan = input.plan || "starter";
  const wl = defaultWhiteLabel(input.name, slug);
  const brandId = nanoid(12);
  const owner = makeOwnerMember(
    brandId,
    input.email,
    input.contactName,
    input.password
  );
  const brand: Brand = {
    id: brandId,
    slug,
    name: input.name,
    email: input.email,
    password: input.password,
    contactName: input.contactName,
    website: input.website || "",
    plan,
    status: "active",
    whiteLabel: wl,
    studioSkin: defaultStudioSkin(input.name, wl),
    seatLimit: PLAN_SEAT_LIMITS[plan],
    members: [owner],
    productCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  db.brands.unshift(brand);
  await saveBrandDb(db);
  const session = await createSession(brand.id, owner);
  return { brand: publicBrand(brand), session };
}

export async function loginBrand(email: string, password: string) {
  const db = await ensureBrandDb();
  const emailLower = email.toLowerCase();

  // Prefer team member login
  for (const brand of db.brands) {
    if (brand.status === "suspended") continue;
    const member = (brand.members || []).find(
      (m) =>
        m.email.toLowerCase() === emailLower &&
        m.password === password &&
        m.status === "active"
    );
    if (member) {
      member.lastLoginAt = new Date().toISOString();
      await saveBrandDb(db);
      const session = await createSession(brand.id, member);
      return {
        brand: publicBrand(brand),
        session,
        member: publicMember(member),
      };
    }
  }

  // Fallback: brand root credentials as owner
  const brand = await getBrandByEmail(email);
  if (!brand || brand.password !== password) {
    throw new Error("Invalid email or password");
  }
  if (brand.status === "suspended") throw new Error("Account suspended");
  const owner =
    brand.members.find((m) => m.role === "owner") ||
    makeOwnerMember(brand.id, brand.email, brand.contactName, brand.password);
  const session = await createSession(brand.id, owner);
  return { brand: publicBrand(brand), session, member: publicMember(owner) };
}

async function createSession(brandId: string, member: BrandMember) {
  const db = await ensureBrandDb();
  const session: BrandSession = {
    brandId,
    email: member.email,
    token: nanoid(32),
    memberId: member.id,
    role: member.role,
    createdAt: new Date().toISOString(),
  };
  // Keep other members' sessions; replace same member sessions
  db.sessions = db.sessions.filter(
    (s) => !(s.brandId === brandId && s.memberId === member.id)
  );
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
  const member =
    brand.members?.find((m) => m.id === session.memberId) ||
    brand.members?.find((m) => m.role === "owner");
  if (!member || member.status === "disabled") return null;
  // Backfill legacy sessions
  if (!session.role) session.role = member.role;
  if (!session.memberId) session.memberId = member.id;
  return {
    session,
    brand: publicBrand(brand),
    full: brand,
    member: publicMember(member),
    role: member.role as TeamRole,
  };
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
  > & {
    whiteLabel?: Partial<WhiteLabelConfig>;
    studioSkin?: Partial<StudioSkinConfig>;
  }
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

  if (patch.plan) {
    db.brands[idx].seatLimit = PLAN_SEAT_LIMITS[patch.plan];
  }

  db.brands[idx] = {
    ...db.brands[idx],
    ...patch,
    whiteLabel: patch.whiteLabel
      ? { ...db.brands[idx].whiteLabel, ...patch.whiteLabel }
      : db.brands[idx].whiteLabel,
    studioSkin: patch.studioSkin
      ? { ...db.brands[idx].studioSkin, ...patch.studioSkin }
      : db.brands[idx].studioSkin,
    updatedAt: new Date().toISOString(),
  };
  await saveBrandDb(db);
  return publicBrand(db.brands[idx]);
}

// ── Team seats ────────────────────────────────────────────
export async function listTeam(brandId: string) {
  const brand = await getBrandById(brandId);
  if (!brand) throw new Error("Brand not found");
  return {
    members: brand.members.map(publicMember),
    seatLimit: brand.seatLimit,
    seatsUsed: brand.members.filter((m) => m.status !== "disabled").length,
    plan: brand.plan,
  };
}

export async function inviteTeamMember(
  brandId: string,
  input: {
    email: string;
    name: string;
    role: TeamRole;
    password?: string;
    invitedBy?: string;
  }
) {
  const db = await ensureBrandDb();
  const idx = db.brands.findIndex((b) => b.id === brandId);
  if (idx === -1) throw new Error("Brand not found");
  const brand = db.brands[idx];

  if (input.role === "owner") {
    throw new Error("Cannot invite another owner");
  }

  const active = brand.members.filter((m) => m.status !== "disabled").length;
  if (active >= brand.seatLimit) {
    throw new Error(
      `Seat limit reached (${brand.seatLimit} on ${brand.plan} plan)`
    );
  }

  const email = input.email.toLowerCase().trim();
  if (brand.members.some((m) => m.email.toLowerCase() === email)) {
    throw new Error("Member already on this brand");
  }

  // Cross-brand email uniqueness for simplicity
  for (const b of db.brands) {
    if (b.members.some((m) => m.email.toLowerCase() === email)) {
      throw new Error("Email already used on another brand");
    }
  }

  const now = new Date().toISOString();
  const member: BrandMember = {
    id: nanoid(10),
    brandId,
    email,
    name: input.name,
    password: input.password || `temp-${nanoid(6)}`,
    role: input.role,
    status: "invited",
    invitedBy: input.invitedBy,
    createdAt: now,
    updatedAt: now,
  };
  brand.members.push(member);
  brand.updatedAt = now;
  await saveBrandDb(db);
  return {
    member: publicMember(member),
    tempPassword: member.password,
  };
}

export async function updateTeamMember(
  brandId: string,
  memberId: string,
  patch: Partial<Pick<BrandMember, "name" | "role" | "status" | "password">>
) {
  const db = await ensureBrandDb();
  const brand = db.brands.find((b) => b.id === brandId);
  if (!brand) throw new Error("Brand not found");
  const mIdx = brand.members.findIndex((m) => m.id === memberId);
  if (mIdx === -1) throw new Error("Member not found");
  const member = brand.members[mIdx];

  if (member.role === "owner" && patch.role && patch.role !== "owner") {
    throw new Error("Cannot demote the owner");
  }
  if (member.role === "owner" && patch.status === "disabled") {
    throw new Error("Cannot disable the owner");
  }
  if (patch.role === "owner" && member.role !== "owner") {
    throw new Error("Cannot promote to owner via this endpoint");
  }

  brand.members[mIdx] = {
    ...member,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  brand.updatedAt = new Date().toISOString();
  await saveBrandDb(db);
  return publicMember(brand.members[mIdx]);
}

export async function removeTeamMember(brandId: string, memberId: string) {
  const db = await ensureBrandDb();
  const brand = db.brands.find((b) => b.id === brandId);
  if (!brand) throw new Error("Brand not found");
  const member = brand.members.find((m) => m.id === memberId);
  if (!member) throw new Error("Member not found");
  if (member.role === "owner") throw new Error("Cannot remove owner");

  brand.members = brand.members.filter((m) => m.id !== memberId);
  brand.updatedAt = new Date().toISOString();
  // Drop their sessions
  db.sessions = db.sessions.filter((s) => s.memberId !== memberId);
  await saveBrandDb(db);
  return { ok: true };
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
