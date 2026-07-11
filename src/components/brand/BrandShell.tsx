"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  CreditCard,
  Globe2,
  LayoutDashboard,
  LogOut,
  Package,
  Sparkles,
  Upload,
  ExternalLink,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand, TeamRole } from "@/lib/types";
import { ROLE_LABELS, roleHasPermission } from "@/lib/rbac";

type PublicBrand = Omit<Brand, "password"> & {
  seatsUsed?: number;
  members?: { id: string; role: TeamRole; name: string; email: string }[];
};

const allLinks = [
  {
    href: "/brand/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    perm: "dashboard:read" as const,
  },
  {
    href: "/brand/products",
    label: "Products",
    icon: Package,
    perm: "products:read" as const,
  },
  {
    href: "/brand/upload",
    label: "CSV upload",
    icon: Upload,
    perm: "csv:import" as const,
  },
  {
    href: "/brand/studio",
    label: "Studio skin",
    icon: Sparkles,
    perm: "studio:write" as const,
  },
  {
    href: "/brand/whitelabel",
    label: "White-label",
    icon: Globe2,
    perm: "whitelabel:write" as const,
  },
  {
    href: "/brand/team",
    label: "Team seats",
    icon: Users,
    perm: "team:read" as const,
  },
  {
    href: "/brand/billing",
    label: "Billing",
    icon: CreditCard,
    perm: "dashboard:read" as const,
  },
];

export function BrandShell({
  brand,
  role,
  memberName,
  children,
}: {
  brand: PublicBrand;
  role?: TeamRole;
  memberName?: string;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();
  const r = role || "owner";

  async function logout() {
    await fetch("/api/brands/logout", { method: "POST" });
    router.push("/brand");
  }

  const preview = `/b/${brand.whiteLabel.subdomain}`;
  const studioPreview = `/b/${brand.whiteLabel.subdomain}/studio`;
  const links = allLinks.filter((l) => roleHasPermission(r, l.perm));

  return (
    <div className="admin-shell min-h-[calc(100vh-108px)]">
      <div className="flex flex-col lg:flex-row">
        <aside className="w-full border-b border-[var(--border)] bg-[var(--panel)] lg:w-56 lg:min-h-[calc(100vh-108px)] lg:border-b-0 lg:border-r">
          <div className="border-b border-[var(--border)] px-5 py-5">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-champagne" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{brand.name}</p>
                <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-dim)]">
                  {brand.plan} · {ROLE_LABELS[r]}
                  {typeof brand.seatsUsed === "number" &&
                    ` · ${brand.seatsUsed}/${brand.seatLimit} seats`}
                </p>
                {memberName && (
                  <p className="mt-0.5 truncate text-[10px] text-[var(--text-dim)]">
                    {memberName}
                  </p>
                )}
              </div>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col">
            {links.map((l) => {
              const Icon = l.icon;
              const active = path === l.href || path.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "flex items-center gap-2.5 whitespace-nowrap px-3 py-2.5 text-xs tracking-wide transition",
                    active
                      ? "bg-[var(--panel-2)] text-[var(--text)]"
                      : "text-[var(--text-dim)] hover:bg-[var(--panel-2)] hover:text-[var(--text)]"
                  )}
                >
                  <Icon size={14} strokeWidth={1.5} />
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-2 border-t border-[var(--border)] p-4">
            <Link
              href={preview}
              target="_blank"
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-champagne hover:underline"
            >
              <ExternalLink size={12} /> Storefront
            </Link>
            <Link
              href={studioPreview}
              target="_blank"
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-champagne hover:underline"
            >
              <Sparkles size={12} /> Branded studio
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)] hover:text-[var(--text)]"
            >
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </aside>
        <div className="flex-1 overflow-x-auto p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
