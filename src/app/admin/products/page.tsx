"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import type { Product, ProductCategory } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [edit, setEdit] = useState<Product | null>(null);

  async function load() {
    const res = await fetch("/api/products?all=true");
    const data = await res.json();
    setProducts(data.products || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const stock = Number(fd.get("stock") || 50);
    const price = Number(fd.get("price") || 0);
    const body = {
      id: edit?.id,
      name: String(fd.get("name")),
      tagline: String(fd.get("tagline") || ""),
      description: String(fd.get("description") || ""),
      category: String(fd.get("category")) as ProductCategory,
      price,
      images: [String(fd.get("image") || "/images/product-foundation.jpg")],
      featured: fd.get("featured") === "on",
      active: fd.get("active") !== "off",
      badges: fd.get("badge") ? [String(fd.get("badge"))] : ["new"],
      variants: edit?.variants || [
        {
          id: `new-${Date.now()}`,
          name: "Default",
          sku: `LM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          price,
          stock,
        },
      ],
    };
    // If editing, update first variant stock/price
    if (edit && body.variants[0]) {
      body.variants = edit.variants.map((v, i) =>
        i === 0 ? { ...v, price, stock } : v
      );
    }

    await fetch(edit ? `/api/products/${edit.id}` : "/api/products", {
      method: edit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    setOpen(false);
    setEdit(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
            Catalog
          </p>
          <h1 className="mt-1 font-display text-4xl">Products</h1>
        </div>
        <button
          className="bg-champagne px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink"
          onClick={() => {
            setEdit(null);
            setOpen(true);
          }}
        >
          Add product
        </button>
      </div>

      <div className="overflow-x-auto border border-[var(--border)] bg-[var(--panel)]">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Variants / Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const units = p.variants.reduce((s, v) => s + v.stock, 0);
              return (
                <tr key={p.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 overflow-hidden bg-[var(--panel-2)]">
                        <Image src={p.images[0]} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-[var(--text-dim)]">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-[var(--text-dim)]">
                    {p.category}
                  </td>
                  <td className="px-4 py-3">{formatMoney(p.price)}</td>
                  <td className="px-4 py-3">
                    {p.variants.length} · {units} units
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.active ? "text-emerald-400" : "text-[var(--text-dim)]"
                      }
                    >
                      {p.active ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="mr-3 text-xs text-champagne hover:underline"
                      onClick={() => {
                        setEdit(p);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs text-red-400 hover:underline"
                      onClick={() => remove(p.id)}
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
            onSubmit={onSubmit}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[var(--border)] bg-[var(--panel)] p-6"
          >
            <h2 className="font-display text-2xl">
              {edit ? "Edit product" : "New product"}
            </h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                  Name
                </label>
                <input
                  name="name"
                  required
                  defaultValue={edit?.name}
                  className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm outline-none focus:border-champagne"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                  Tagline
                </label>
                <input
                  name="tagline"
                  defaultValue={edit?.tagline}
                  className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm outline-none focus:border-champagne"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={edit?.description}
                  className="min-h-[80px] w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm outline-none focus:border-champagne"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={edit?.category || "makeup"}
                    className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm"
                  >
                    <option value="makeup">Makeup</option>
                    <option value="skin">Skin</option>
                    <option value="hair">Hair</option>
                    <option value="body">Body</option>
                    <option value="tools">Tools</option>
                    <option value="sets">Sets</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                    Price
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    defaultValue={edit?.price ?? 29}
                    className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                    Stock (primary variant)
                  </label>
                  <input
                    name="stock"
                    type="number"
                    defaultValue={edit?.variants[0]?.stock ?? 50}
                    className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                    Badge
                  </label>
                  <select
                    name="badge"
                    defaultValue={edit?.badges[0] || "new"}
                    className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm"
                  >
                    <option value="new">New</option>
                    <option value="bestseller">Bestseller</option>
                    <option value="limited">Limited</option>
                    <option value="viral">Viral</option>
                    <option value="coming-soon">Coming soon</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                  Image path
                </label>
                <select
                  name="image"
                  defaultValue={edit?.images[0] || "/images/product-foundation.jpg"}
                  className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm"
                >
                  <option value="/images/product-foundation.jpg">Foundation</option>
                  <option value="/images/product-gloss.jpg">Gloss</option>
                  <option value="/images/product-bodycream.jpg">Body cream</option>
                  <option value="/images/product-bronzer.jpg">Bronzer</option>
                  <option value="/images/product-hairoil.jpg">Hair oil</option>
                  <option value="/images/skincare-still.jpg">Skincare</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={edit?.featured}
                />
                Featured on homepage
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-champagne px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink"
              >
                {saving ? "Saving..." : "Save product"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setEdit(null);
                }}
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
