"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  Globe2,
  LayoutDashboard,
  LogOut,
  Package,
  Upload,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/types";

const links = [
  { href: "/brand/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/brand/products", label: "Products", icon: Package },
  { href: "/brand/upload", label: "CSV upload", icon: Upload },
  { href: "/brand/whitelabel", label: "White-label", icon: Globe2 },
];

export function BrandShell({
  brand,
  children,
}: {
  brand: Omit<Brand, "password">;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/brands/logout", { method: "POST" });
    router.push("/brand");
  }

  const preview = `/b/${brand.whiteLabel.subdomain}`;

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
                  {brand.plan} · Brand portal
                </p>
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
              <ExternalLink size={12} /> Preview storefront
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
