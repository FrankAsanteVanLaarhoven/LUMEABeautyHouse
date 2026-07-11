export type ProductCategory =
  | "makeup"
  | "skin"
  | "hair"
  | "body"
  | "sets"
  | "tools";

export type ProductBadge =
  | "new"
  | "bestseller"
  | "limited"
  | "viral"
  | "coming-soon";

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  shadeHex?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  subcategory?: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  badges: ProductBadge[];
  shades?: number;
  sizes?: string[];
  variants: ProductVariant[];
  ingredients?: string[];
  howToUse?: string;
  featured?: boolean;
  active: boolean;
  /** Multi-tenant: owning brand (null / "lumea" = house brand) */
  brandId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type BrandPlan = "starter" | "growth" | "enterprise";
export type BrandStatus = "pending" | "active" | "suspended";

export interface WhiteLabelConfig {
  /** Public storefront path slug: /b/{subdomain} */
  subdomain: string;
  /** Optional custom domain e.g. shop.brand.com */
  customDomain: string;
  storeName: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  logoUrl: string;
  faviconUrl: string;
  supportEmail: string;
  enabled: boolean;
}

/** Per-brand Mirror Studio visual skin */
export interface StudioSkinConfig {
  enabled: boolean;
  studioName: string;
  headline: string;
  subheadline: string;
  defaultLook: "mirror-white" | "soft-luxe" | "brand";
  frameColor: string;
  ringLightColor: string;
  panelColor: string;
  textColor: string;
  accentColor: string;
  buttonColor: string;
  buttonTextColor: string;
  logoUrl: string;
  watermark: string;
  showPoweredBy: boolean;
  defaultBrightness: number;
  defaultIntensity: number;
}

export type TeamRole = "owner" | "admin" | "editor" | "viewer";

export type TeamPermission =
  | "dashboard:read"
  | "products:read"
  | "products:write"
  | "csv:import"
  | "whitelabel:write"
  | "studio:write"
  | "team:read"
  | "team:write"
  | "billing:write";

export interface BrandMember {
  id: string;
  brandId: string;
  email: string;
  name: string;
  /** Demo auth */
  password: string;
  role: TeamRole;
  status: "active" | "invited" | "disabled";
  invitedBy?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  email: string;
  /** Demo auth — not production crypto */
  password: string;
  contactName: string;
  website: string;
  plan: BrandPlan;
  status: BrandStatus;
  whiteLabel: WhiteLabelConfig;
  studioSkin: StudioSkinConfig;
  /** Seat cap by plan (starter 2 / growth 5 / enterprise 25) */
  seatLimit: number;
  members: BrandMember[];
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BrandSession {
  brandId: string;
  email: string;
  token: string;
  memberId: string;
  role: TeamRole;
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "fulfilled"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type FulfillmentStatus =
  | "unfulfilled"
  | "partial"
  | "fulfilled"
  | "restocked";

export interface OrderLineItem {
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  email: string;
  status: OrderStatus;
  fulfillmentStatus: FulfillmentStatus;
  items: OrderLineItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  billingAddress?: Address;
  trackingNumber?: string;
  notes?: string;
  promoCode?: string;
  createdAt: string;
  updatedAt: string;
  fulfilledAt?: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  totalOrders: number;
  totalSpent: number;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  variantId: string;
  sku: string;
  delta: number;
  reason: "sale" | "restock" | "adjustment" | "return" | "damage";
  note?: string;
  orderId?: string;
  createdAt: string;
}

export interface PromoCode {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSubtotal?: number;
  active: boolean;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface StoreSettings {
  storeName: string;
  currency: string;
  freeShippingThreshold: number;
  shippingFlatRate: number;
  taxRate: number;
}
