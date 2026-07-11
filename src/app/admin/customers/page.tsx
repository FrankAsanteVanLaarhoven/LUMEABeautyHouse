"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Customer } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/utils";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/customers");
    const data = await res.json();
    setCustomers(data.customers || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        firstName: fd.get("firstName"),
        lastName: fd.get("lastName"),
        phone: fd.get("phone"),
        tags: String(fd.get("tags") || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        notes: fd.get("notes"),
        addresses: [],
      }),
    });
    setSaving(false);
    setOpen(false);
    load();
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
            CRM
          </p>
          <h1 className="mt-1 font-display text-4xl">Customers</h1>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-champagne px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink"
        >
          Add customer
        </button>
      </div>

      <div className="overflow-x-auto border border-[var(--border)] bg-[var(--panel)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">LTV</th>
              <th className="px-4 py-3 font-medium">Tags</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 font-medium">
                  {c.firstName} {c.lastName}
                </td>
                <td className="px-4 py-3 text-[var(--text-dim)]">
                  <p>{c.email}</p>
                  {c.phone && (
                    <p className="text-xs">{c.phone}</p>
                  )}
                </td>
                <td className="px-4 py-3">{c.totalOrders}</td>
                <td className="px-4 py-3">{formatMoney(c.totalSpent)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="border border-[var(--border)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--text-dim)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--text-dim)]">
                  {formatDate(c.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <form
            onSubmit={onSubmit}
            className="w-full max-w-md border border-[var(--border)] bg-[var(--panel)] p-6"
          >
            <h2 className="font-display text-2xl">Add customer</h2>
            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="firstName"
                  required
                  placeholder="First name"
                  className="border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm"
                />
                <input
                  name="lastName"
                  required
                  placeholder="Last name"
                  className="border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm"
                />
              </div>
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm"
              />
              <input
                name="phone"
                placeholder="Phone"
                className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm"
              />
              <input
                name="tags"
                placeholder="Tags (comma-separated)"
                className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm"
              />
              <textarea
                name="notes"
                placeholder="Notes"
                className="min-h-[70px] w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm"
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-champagne px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border border-[var(--border)] px-5 py-2.5 text-[11px] uppercase tracking-[0.14em]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
