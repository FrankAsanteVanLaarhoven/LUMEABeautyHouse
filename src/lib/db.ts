import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import type {
  Customer,
  InventoryMovement,
  Order,
  Product,
  PromoCode,
  StoreSettings,
} from "./types";
import { seedProducts, seedCustomers, seedOrders, seedPromos } from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");

interface Database {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  inventoryLog: InventoryMovement[];
  promos: PromoCode[];
  settings: StoreSettings;
}

const defaultSettings: StoreSettings = {
  storeName: "LUMÉA",
  currency: "USD",
  freeShippingThreshold: 75,
  shippingFlatRate: 8,
  taxRate: 0.08,
};

async function ensureDb(): Promise<Database> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, "store.json");
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as Database;
  } catch {
    const db: Database = {
      products: seedProducts(),
      orders: seedOrders(),
      customers: seedCustomers(),
      inventoryLog: [],
      promos: seedPromos(),
      settings: defaultSettings,
    };
    await fs.writeFile(file, JSON.stringify(db, null, 2));
    return db;
  }
}

async function saveDb(db: Database) {
  const file = path.join(DATA_DIR, "store.json");
  await fs.writeFile(file, JSON.stringify(db, null, 2));
}

export async function getDb() {
  return ensureDb();
}

export async function getSettings() {
  const db = await ensureDb();
  return db.settings;
}

// ── Products ──────────────────────────────────────────────
export async function listProducts(opts?: {
  category?: string;
  featured?: boolean;
  activeOnly?: boolean;
  q?: string;
  brandId?: string | null;
  /** Department-store brand floor slug */
  houseBrand?: string | null;
  /** When true, only house catalogue (no brandId or lumea) */
  houseOnly?: boolean;
}) {
  const { brandSlugForProduct, getHouseBrand, searchBrands } = await import(
    "./house-brands"
  );
  const db = await ensureDb();
  let items = [...db.products];
  if (opts?.activeOnly !== false) items = items.filter((p) => p.active);
  if (opts?.category && opts.category !== "all") {
    items = items.filter((p) => p.category === opts.category);
  }
  if (opts?.featured) items = items.filter((p) => p.featured);
  if (opts?.brandId) {
    items = items.filter((p) => p.brandId === opts.brandId);
  }
  if (opts?.houseBrand) {
    const hb = opts.houseBrand.toLowerCase();
    items = items.filter((p) => brandSlugForProduct(p) === hb);
  }
  if (opts?.houseOnly) {
    items = items.filter(
      (p) => !p.brandId || p.brandId === "brand-lumea" || p.brandId === "lumea"
    );
  }
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    // Brand-name hits → include all products on those brand floors
    const brandHits = searchBrands(q).map((b) => b.slug);
    items = items.filter((p) => {
      const brandSlug = brandSlugForProduct(p);
      const brand = getHouseBrand(brandSlug);
      return (
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        brandSlug.includes(q) ||
        brand?.name.toLowerCase().includes(q) ||
        brandHits.includes(brandSlug)
      );
    });
  }
  return items.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getProductBySlug(slug: string) {
  const db = await ensureDb();
  return db.products.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string) {
  const db = await ensureDb();
  return db.products.find((p) => p.id === id) ?? null;
}

export async function upsertProduct(
  input: Partial<Product> & { name: string }
): Promise<Product> {
  const db = await ensureDb();
  const now = new Date().toISOString();
  if (input.id) {
    const idx = db.products.findIndex((p) => p.id === input.id);
    if (idx === -1) throw new Error("Product not found");
    db.products[idx] = {
      ...db.products[idx],
      ...input,
      updatedAt: now,
    } as Product;
    await saveDb(db);
    return db.products[idx];
  }
  const product: Product = {
    id: nanoid(10),
    slug:
      input.slug ||
      input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    name: input.name,
    tagline: input.tagline || "",
    description: input.description || "",
    category: input.category || "makeup",
    subcategory: input.subcategory,
    images: input.images || ["/images/product-foundation.jpg"],
    price: input.price ?? 0,
    compareAtPrice: input.compareAtPrice,
    rating: input.rating ?? 5,
    reviewCount: input.reviewCount ?? 0,
    badges: input.badges || ["new"],
    shades: input.shades,
    sizes: input.sizes,
    variants: input.variants || [
      {
        id: nanoid(8),
        name: "Default",
        sku: `LM-${nanoid(6).toUpperCase()}`,
        price: input.price ?? 0,
        stock: 50,
      },
    ],
    ingredients: input.ingredients,
    howToUse: input.howToUse,
    featured: input.featured ?? false,
    active: input.active ?? true,
    brandId: input.brandId ?? null,
    createdAt: now,
    updatedAt: now,
  };
  db.products.unshift(product);
  await saveDb(db);
  return product;
}

export async function deleteProduct(id: string) {
  const db = await ensureDb();
  db.products = db.products.filter((p) => p.id !== id);
  await saveDb(db);
}

// ── Inventory ─────────────────────────────────────────────
export async function adjustInventory(params: {
  productId: string;
  variantId: string;
  delta: number;
  reason: InventoryMovement["reason"];
  note?: string;
  orderId?: string;
}) {
  const db = await ensureDb();
  const product = db.products.find((p) => p.id === params.productId);
  if (!product) throw new Error("Product not found");
  const variant = product.variants.find((v) => v.id === params.variantId);
  if (!variant) throw new Error("Variant not found");
  variant.stock = Math.max(0, variant.stock + params.delta);
  product.updatedAt = new Date().toISOString();
  const movement: InventoryMovement = {
    id: nanoid(10),
    productId: params.productId,
    variantId: params.variantId,
    sku: variant.sku,
    delta: params.delta,
    reason: params.reason,
    note: params.note,
    orderId: params.orderId,
    createdAt: new Date().toISOString(),
  };
  db.inventoryLog.unshift(movement);
  await saveDb(db);
  return { product, movement };
}

export async function getInventorySummary() {
  const db = await ensureDb();
  const rows = db.products.flatMap((p) =>
    p.variants.map((v) => ({
      productId: p.id,
      productName: p.name,
      variantId: v.id,
      variantName: v.name,
      sku: v.sku,
      stock: v.stock,
      price: v.price,
      category: p.category,
      image: v.image || p.images[0],
      status:
        v.stock <= 0
          ? "out"
          : v.stock <= 8
            ? "critical"
            : v.stock <= 25
              ? "low"
              : "ok",
    }))
  );
  return {
    rows,
    log: db.inventoryLog.slice(0, 50),
    totals: {
      skus: rows.length,
      outOfStock: rows.filter((r) => r.status === "out").length,
      lowStock: rows.filter((r) => r.status === "low" || r.status === "critical")
        .length,
      units: rows.reduce((s, r) => s + r.stock, 0),
    },
  };
}

// ── Orders ────────────────────────────────────────────────
export async function listOrders() {
  const db = await ensureDb();
  return [...db.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrder(id: string) {
  const db = await ensureDb();
  return db.orders.find((o) => o.id === id || o.orderNumber === id) ?? null;
}

export async function createOrder(
  input: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">
): Promise<Order> {
  const db = await ensureDb();
  // Deduct stock
  for (const item of input.items) {
    const product = db.products.find((p) => p.id === item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    if (!variant || variant.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.name}`);
    }
    variant.stock -= item.quantity;
    db.inventoryLog.unshift({
      id: nanoid(10),
      productId: item.productId,
      variantId: item.variantId,
      sku: item.sku,
      delta: -item.quantity,
      reason: "sale",
      createdAt: new Date().toISOString(),
    });
  }

  // Upsert customer
  let customer = db.customers.find(
    (c) => c.email.toLowerCase() === input.email.toLowerCase()
  );
  if (!customer) {
    customer = {
      id: nanoid(10),
      email: input.email,
      firstName: input.shippingAddress.firstName,
      lastName: input.shippingAddress.lastName,
      phone: input.shippingAddress.phone,
      addresses: [input.shippingAddress],
      totalOrders: 0,
      totalSpent: 0,
      tags: ["new"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.customers.unshift(customer);
  }
  customer.totalOrders += 1;
  customer.totalSpent += input.total;
  customer.updatedAt = new Date().toISOString();

  const now = new Date().toISOString();
  const order: Order = {
    ...input,
    id: nanoid(12),
    orderNumber: `LM${Date.now().toString().slice(-8)}`,
    customerId: customer.id,
    createdAt: now,
    updatedAt: now,
  };
  db.orders.unshift(order);
  await saveDb(db);
  return order;
}

export async function updateOrder(
  id: string,
  patch: Partial<Order>
): Promise<Order> {
  const db = await ensureDb();
  const idx = db.orders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (idx === -1) throw new Error("Order not found");
  db.orders[idx] = {
    ...db.orders[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  if (patch.fulfillmentStatus === "fulfilled" && !db.orders[idx].fulfilledAt) {
    db.orders[idx].fulfilledAt = new Date().toISOString();
    db.orders[idx].status =
      patch.status ||
      (db.orders[idx].status === "paid" || db.orders[idx].status === "processing"
        ? "fulfilled"
        : db.orders[idx].status);
  }
  await saveDb(db);
  return db.orders[idx];
}

// ── Customers ─────────────────────────────────────────────
export async function listCustomers() {
  const db = await ensureDb();
  return [...db.customers].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getCustomer(id: string) {
  const db = await ensureDb();
  return db.customers.find((c) => c.id === id) ?? null;
}

export async function upsertCustomer(
  input: Partial<Customer> & { email: string; firstName: string; lastName: string }
): Promise<Customer> {
  const db = await ensureDb();
  const now = new Date().toISOString();
  if (input.id) {
    const idx = db.customers.findIndex((c) => c.id === input.id);
    if (idx === -1) throw new Error("Customer not found");
    db.customers[idx] = { ...db.customers[idx], ...input, updatedAt: now };
    await saveDb(db);
    return db.customers[idx];
  }
  const customer: Customer = {
    id: nanoid(10),
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    addresses: input.addresses || [],
    totalOrders: input.totalOrders ?? 0,
    totalSpent: input.totalSpent ?? 0,
    tags: input.tags || [],
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
  };
  db.customers.unshift(customer);
  await saveDb(db);
  return customer;
}

export async function getPromo(code: string) {
  const db = await ensureDb();
  return (
    db.promos.find(
      (p) => p.active && p.code.toUpperCase() === code.toUpperCase()
    ) ?? null
  );
}

export async function getDashboardStats() {
  const db = await ensureDb();
  const revenue = db.orders
    .filter((o) => !["cancelled", "refunded"].includes(o.status))
    .reduce((s, o) => s + o.total, 0);
  const pendingFulfillment = db.orders.filter(
    (o) =>
      o.fulfillmentStatus === "unfulfilled" &&
      !["cancelled", "refunded"].includes(o.status)
  ).length;
  const lowStock = db.products
    .flatMap((p) => p.variants)
    .filter((v) => v.stock <= 25).length;
  return {
    revenue,
    orders: db.orders.length,
    customers: db.customers.length,
    products: db.products.filter((p) => p.active).length,
    pendingFulfillment,
    lowStock,
    recentOrders: db.orders.slice(0, 5),
  };
}
