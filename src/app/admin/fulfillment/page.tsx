"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/utils";

export default function FulfillmentPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders || []);
  }

  useEffect(() => {
    load();
  }, []);

  const queue = orders.filter(
    (o) =>
      o.fulfillmentStatus === "unfulfilled" &&
      !["cancelled", "refunded"].includes(o.status)
  );
  const fulfilled = orders.filter((o) => o.fulfillmentStatus === "fulfilled");

  async function fulfill(order: Order) {
    setBusy(order.id);
    const tn =
      tracking[order.id] ||
      `1Z${Math.random().toString().slice(2, 14).toUpperCase()}`;
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fulfillmentStatus: "fulfilled",
        status: "shipped",
        trackingNumber: tn,
      }),
    });
    setBusy(null);
    load();
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
          Warehouse
        </p>
        <h1 className="mt-1 font-display text-4xl">Fulfillment</h1>
        <p className="mt-2 text-sm text-[var(--text-dim)]">
          {queue.length} order{queue.length === 1 ? "" : "s"} waiting to ship
        </p>
      </div>

      <div className="space-y-4">
        {queue.length === 0 && (
          <div className="border border-[var(--border)] bg-[var(--panel)] p-10 text-center text-[var(--text-dim)]">
            Fulfillment queue is clear. New paid orders appear here.
          </div>
        )}
        {queue.map((o) => (
          <div
            key={o.id}
            className="border border-[var(--border)] bg-[var(--panel)] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium">{o.orderNumber}</p>
                <p className="mt-1 text-sm text-[var(--text-dim)]">
                  {o.email} · {formatDate(o.createdAt)} ·{" "}
                  {formatMoney(o.total)}
                </p>
                <p className="mt-3 text-sm">
                  {o.shippingAddress.firstName} {o.shippingAddress.lastName}
                  <br />
                  {o.shippingAddress.line1}, {o.shippingAddress.city}{" "}
                  {o.shippingAddress.state} {o.shippingAddress.postalCode}
                </p>
              </div>
              <div className="w-full max-w-xs space-y-2">
                <input
                  placeholder="Tracking number"
                  value={tracking[o.id] || ""}
                  onChange={(e) =>
                    setTracking((t) => ({ ...t, [o.id]: e.target.value }))
                  }
                  className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm outline-none focus:border-champagne"
                />
                <button
                  disabled={busy === o.id}
                  onClick={() => fulfill(o)}
                  className="w-full bg-champagne py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink disabled:opacity-50"
                >
                  {busy === o.id ? "Fulfilling..." : "Mark fulfilled & ship"}
                </button>
              </div>
            </div>
            <ul className="mt-4 border-t border-[var(--border)] pt-4 text-sm">
              {o.items.map((i) => (
                <li
                  key={i.sku}
                  className="flex justify-between py-1 text-[var(--text-dim)]"
                >
                  <span>
                    {i.name} — {i.variantName}
                  </span>
                  <span className="font-mono text-xs">
                    {i.sku} × {i.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {fulfilled.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-sm font-medium text-[var(--text-dim)]">
            Recently fulfilled
          </h2>
          <div className="space-y-2">
            {fulfilled.slice(0, 8).map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-2 border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm"
              >
                <span>{o.orderNumber}</span>
                <span className="font-mono text-xs text-[var(--text-dim)]">
                  {o.trackingNumber || "—"}
                </span>
                <span className="text-emerald-400 capitalize">
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
