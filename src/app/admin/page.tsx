"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate, formatMoney } from "@/lib/utils";
import type { Order } from "@/lib/types";

interface Stats {
  revenue: number;
  orders: number;
  customers: number;
  products: number;
  pendingFulfillment: number;
  lowStock: number;
  recentOrders: Order[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return <p className="text-[var(--text-dim)]">Loading ops data...</p>;
  }

  const cards = [
    { label: "Revenue", value: formatMoney(stats.revenue), href: "/admin/orders" },
    { label: "Orders", value: String(stats.orders), href: "/admin/orders" },
    { label: "Customers", value: String(stats.customers), href: "/admin/customers" },
    { label: "Active SKUs", value: String(stats.products), href: "/admin/products" },
    {
      label: "To fulfill",
      value: String(stats.pendingFulfillment),
      href: "/admin/fulfillment",
      alert: stats.pendingFulfillment > 0,
    },
    {
      label: "Low stock",
      value: String(stats.lowStock),
      href: "/admin/inventory",
      alert: stats.lowStock > 0,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
          Overview
        </p>
        <h1 className="mt-1 font-display text-4xl text-[var(--text)]">
          Dashboard
        </h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="border border-[var(--border)] bg-[var(--panel)] p-5 transition hover:border-champagne/40"
          >
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-dim)]">
              {c.label}
            </p>
            <p
              className={`mt-2 font-display text-3xl ${
                c.alert ? "text-champagne" : "text-[var(--text)]"
              }`}
            >
              {c.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 border border-[var(--border)] bg-[var(--panel)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-sm font-medium">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)] hover:text-champagne"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Fulfillment</th>
                <th className="px-5 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((o) => (
                <tr key={o.id} className="border-t border-[var(--border)]">
                  <td className="px-5 py-3">
                    <p className="font-medium">{o.orderNumber}</p>
                    <p className="text-xs text-[var(--text-dim)]">
                      {formatDate(o.createdAt)}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-[var(--text-dim)]">{o.email}</td>
                  <td className="px-5 py-3 capitalize">{o.status}</td>
                  <td className="px-5 py-3 capitalize">{o.fulfillmentStatus}</td>
                  <td className="px-5 py-3 text-right">
                    {formatMoney(o.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
