"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Users,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/useT";

export function AdminNav() {
  const path = usePathname();
  const { t } = useT();
  const links = [
    { href: "/admin", label: t("admin.dashboard"), icon: LayoutDashboard },
    { href: "/admin/products", label: t("admin.products"), icon: Package },
    { href: "/admin/inventory", label: t("admin.inventory"), icon: Boxes },
    { href: "/admin/orders", label: t("admin.orders"), icon: ShoppingCart },
    { href: "/admin/fulfillment", label: t("admin.fulfillment"), icon: Truck },
    { href: "/admin/customers", label: t("admin.customers"), icon: Users },
  ];
  return (
    <aside className="flex w-full flex-col border-b border-[var(--border)] bg-[var(--panel)] lg:w-56 lg:border-b-0 lg:border-r lg:min-h-[calc(100vh-36px)]">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-5">
        <Store size={16} className="text-champagne" />
        <div>
          <p className="font-display text-lg tracking-[0.16em]">{t("brand.name")}</p>
          <p className="text-[9px] uppercase tracking-[0.18em] text-[var(--text-dim)]">
            {t("admin.ops")}
          </p>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col">
        {links.map((l) => {
          const active =
            l.href === "/admin" ? path === "/admin" : path.startsWith(l.href);
          const Icon = l.icon;
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
      <div className="mt-auto hidden border-t border-[var(--border)] p-4 lg:block">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-dim)] hover:text-[var(--text)]"
        >
          ← {t("admin.storefront")}
        </Link>
      </div>
    </aside>
  );
}
