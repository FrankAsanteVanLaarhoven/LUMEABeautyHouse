"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface Row {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  sku: string;
  stock: number;
  price: number;
  category: string;
  status: string;
}

interface Log {
  id: string;
  sku: string;
  delta: number;
  reason: string;
  note?: string;
  createdAt: string;
}

export default function InventoryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [log, setLog] = useState<Log[]>([]);
  const [totals, setTotals] = useState({
    skus: 0,
    outOfStock: 0,
    lowStock: 0,
    units: 0,
  });
  const [adjust, setAdjust] = useState<Row | null>(null);
  const [delta, setDelta] = useState(10);
  const [reason, setReason] = useState("restock");

  async function load() {
    const res = await fetch("/api/inventory");
    const data = await res.json();
    setRows(data.rows || []);
    setLog(data.log || []);
    setTotals(data.totals || totals);
  }

  useEffect(() => {
    load();
  }, []);

  async function submitAdjust() {
    if (!adjust) return;
    await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: adjust.productId,
        variantId: adjust.variantId,
        delta,
        reason,
        note: "Admin adjustment",
      }),
    });
    setAdjust(null);
    load();
  }

  const statusColor: Record<string, string> = {
    ok: "text-emerald-400",
    low: "text-amber-400",
    critical: "text-orange-400",
    out: "text-red-400",
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
          Stock levels
        </p>
        <h1 className="mt-1 font-display text-4xl">Inventory</h1>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: "SKUs", v: totals.skus },
          { l: "Total units", v: totals.units },
          { l: "Low stock", v: totals.lowStock },
          { l: "Out of stock", v: totals.outOfStock },
        ].map((c) => (
          <div
            key={c.l}
            className="border border-[var(--border)] bg-[var(--panel)] p-4"
          >
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
              {c.l}
            </p>
            <p className="mt-1 font-display text-2xl">{c.v}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto border border-[var(--border)] bg-[var(--panel)]">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Variant</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Adjust</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.variantId} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 font-mono text-xs">{r.sku}</td>
                <td className="px-4 py-3">{r.productName}</td>
                <td className="px-4 py-3 text-[var(--text-dim)]">
                  {r.variantName}
                </td>
                <td className="px-4 py-3 font-medium tabular-nums">{r.stock}</td>
                <td className={`px-4 py-3 capitalize ${statusColor[r.status]}`}>
                  {r.status}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      setAdjust(r);
                      setDelta(10);
                      setReason("restock");
                    }}
                    className="text-xs text-champagne hover:underline"
                  >
                    Adjust
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 border border-[var(--border)] bg-[var(--panel)]">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-sm font-medium">Recent movements</h2>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {log.length === 0 && (
            <li className="px-5 py-4 text-sm text-[var(--text-dim)]">
              No movements yet — sales and restocks will appear here.
            </li>
          )}
          {log.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between px-5 py-3 text-sm"
            >
              <div>
                <span className="font-mono text-xs">{m.sku}</span>
                <span className="mx-2 text-[var(--text-dim)]">·</span>
                <span className="capitalize text-[var(--text-dim)]">
                  {m.reason}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={
                    m.delta >= 0 ? "text-emerald-400" : "text-red-400"
                  }
                >
                  {m.delta >= 0 ? "+" : ""}
                  {m.delta}
                </span>
                <span className="text-xs text-[var(--text-dim)]">
                  {formatDate(m.createdAt)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {adjust && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md border border-[var(--border)] bg-[var(--panel)] p-6">
            <h2 className="font-display text-2xl">Adjust stock</h2>
            <p className="mt-1 text-sm text-[var(--text-dim)]">
              {adjust.productName} — {adjust.variantName} ({adjust.sku})
            </p>
            <p className="mt-2 text-sm">Current: {adjust.stock}</p>
            <div className="mt-5 space-y-3">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                  Delta (+ restock / − reduce)
                </label>
                <input
                  type="number"
                  value={delta}
                  onChange={(e) => setDelta(Number(e.target.value))}
                  className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                  Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm"
                >
                  <option value="restock">Restock</option>
                  <option value="adjustment">Adjustment</option>
                  <option value="return">Return</option>
                  <option value="damage">Damage</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={submitAdjust}
                className="bg-champagne px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink"
              >
                Apply
              </button>
              <button
                onClick={() => setAdjust(null)}
                className="border border-[var(--border)] px-5 py-2.5 text-[11px] uppercase tracking-[0.14em]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
