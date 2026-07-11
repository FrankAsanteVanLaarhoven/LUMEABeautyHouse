"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);

  async function load() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
    if (selected?.id === id) {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      setSelected(data.order);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
          Commerce
        </p>
        <h1 className="mt-1 font-display text-4xl">Orders</h1>
      </div>

      <div className="overflow-x-auto border border-[var(--border)] bg-[var(--panel)]">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Fulfillment</th>
              <th className="px-4 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className="cursor-pointer border-t border-[var(--border)] hover:bg-[var(--panel-2)]"
                onClick={() => setSelected(o)}
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{o.orderNumber}</p>
                  <p className="text-xs text-[var(--text-dim)]">
                    {formatDate(o.createdAt)}
                  </p>
                </td>
                <td className="px-4 py-3 text-[var(--text-dim)]">{o.email}</td>
                <td className="px-4 py-3">
                  {o.items.reduce((s, i) => s + i.quantity, 0)}
                </td>
                <td className="px-4 py-3 capitalize">{o.status}</td>
                <td className="px-4 py-3 capitalize">{o.fulfillmentStatus}</td>
                <td className="px-4 py-3 text-right">{formatMoney(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[var(--border)] bg-[var(--panel)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl">{selected.orderNumber}</h2>
            <p className="mt-1 text-sm text-[var(--text-dim)]">
              {selected.email} · {formatDate(selected.createdAt)}
            </p>

            <ul className="mt-6 space-y-3 border-y border-[var(--border)] py-4">
              {selected.items.map((i) => (
                <li key={i.sku} className="flex justify-between text-sm">
                  <span>
                    {i.name}
                    <span className="block text-xs text-[var(--text-dim)]">
                      {i.variantName} · {i.sku} × {i.quantity}
                    </span>
                  </span>
                  <span>{formatMoney(i.unitPrice * i.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between text-[var(--text-dim)]">
                <span>Subtotal</span>
                <span>{formatMoney(selected.subtotal)}</span>
              </div>
              {selected.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-{formatMoney(selected.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[var(--text-dim)]">
                <span>Shipping</span>
                <span>{formatMoney(selected.shipping)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-dim)]">
                <span>Tax</span>
                <span>{formatMoney(selected.tax)}</span>
              </div>
              <div className="flex justify-between pt-2 font-medium">
                <span>Total</span>
                <span className="font-display text-xl">
                  {formatMoney(selected.total)}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                Ship to
              </p>
              <p className="mt-1 text-sm">
                {selected.shippingAddress.firstName}{" "}
                {selected.shippingAddress.lastName}
                <br />
                {selected.shippingAddress.line1}
                <br />
                {selected.shippingAddress.city}, {selected.shippingAddress.state}{" "}
                {selected.shippingAddress.postalCode}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {["paid", "processing", "shipped", "delivered", "cancelled"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`border px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] capitalize ${
                      selected.status === s
                        ? "border-champagne text-champagne"
                        : "border-[var(--border)] text-[var(--text-dim)]"
                    }`}
                  >
                    {s}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 text-xs text-[var(--text-dim)] hover:text-[var(--text)]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
