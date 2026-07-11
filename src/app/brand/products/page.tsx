"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { BrandShell } from "@/components/brand/BrandShell";
import { useBrandPortal } from "@/hooks/useBrandPortal";
import type { ProductCategory } from "@/lib/types";

export default function BrandProductsPage() {
  const { brand, role, member, products, loading, reload } = useBrandPortal();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    await reload();
  }

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const price = Number(fd.get("price") || 0);
    const stock = Number(fd.get("stock") || 50);
    await fetch("/api/brands/me/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        tagline: fd.get("tagline"),
        description: fd.get("description"),
        category: fd.get("category") as ProductCategory,
        price,
        images: [String(fd.get("image") || "/images/product-foundation.jpg")],
        badges: ["new"],
        variants: [
          {
            id: `v-${Date.now()}`,
            name: String(fd.get("variant") || "Default"),
            sku: String(fd.get("sku") || `SKU-${Date.now()}`),
            price,
            stock,
            shadeHex: String(fd.get("hex") || "") || undefined,
          },
        ],
      }),
    });
    setSaving(false);
    setOpen(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/brands/me/products?id=${id}`, { method: "DELETE" });
    load();
  }

  if (loading || !brand) {
    return <div className="p-16 text-center text-muted">Loading…</div>;
  }

  return (
    <BrandShell brand={brand} role={role} memberName={member?.name}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
            Catalogue
          </p>
          <h1 className="mt-1 font-display text-4xl text-[var(--text)]">
            Products
          </h1>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-champagne px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink"
        >
          Add product
        </button>
      </div>

      <div className="overflow-x-auto border border-[var(--border)] bg-[var(--panel)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[var(--text-dim)]">
                  No products yet — add one or upload a CSV.
                </td>
              </tr>
            )}
            {products.map((p) => {
              const units = p.variants.reduce((s, v) => s + v.stock, 0);
              return (
                <tr key={p.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-8 overflow-hidden bg-[var(--panel-2)]">
                        <Image
                          src={p.images[0]}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text)]">{p.name}</p>
                        <p className="text-xs text-[var(--text-dim)]">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-[var(--text-dim)]">
                    {p.category}
                  </td>
                  <td className="px-4 py-3 text-[var(--text)]">${p.price}</td>
                  <td className="px-4 py-3 text-[var(--text)]">{units}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove(p.id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <form
            onSubmit={onCreate}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[var(--border)] bg-[var(--panel)] p-6"
          >
            <h2 className="font-display text-2xl text-[var(--text)]">New product</h2>
            <div className="mt-5 space-y-3">
              <input name="name" required placeholder="Name" className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]" />
              <input name="tagline" placeholder="Tagline" className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]" />
              <textarea name="description" placeholder="Description" className="min-h-[70px] w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]" />
              <div className="grid grid-cols-2 gap-3">
                <select name="category" className="border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]" defaultValue="makeup">
                  <option value="makeup">Makeup</option>
                  <option value="skin">Skin</option>
                  <option value="hair">Hair</option>
                  <option value="body">Body</option>
                  <option value="tools">Tools</option>
                  <option value="sets">Sets</option>
                </select>
                <input name="price" type="number" step="0.01" required placeholder="Price" defaultValue={29} className="border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]" />
                <input name="stock" type="number" placeholder="Stock" defaultValue={50} className="border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]" />
                <input name="sku" placeholder="SKU" className="border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]" />
                <input name="variant" placeholder="Variant / shade" className="border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]" />
                <input name="hex" placeholder="#hex optional" className="border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]" />
              </div>
              <select name="image" className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]" defaultValue="/images/product-foundation.jpg">
                <option value="/images/product-foundation.jpg">Foundation</option>
                <option value="/images/product-gloss.jpg">Gloss</option>
                <option value="/images/product-contour.jpg">Contour</option>
                <option value="/images/product-haircare.jpg">Hair</option>
                <option value="/images/product-bodyoil.jpg">Body oil</option>
                <option value="/images/product-brushes.jpg">Brushes</option>
              </select>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={saving} className="bg-champagne px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink">
                {saving ? "Saving…" : "Save"}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="border border-[var(--border)] px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-[var(--text)]">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </BrandShell>
  );
}
