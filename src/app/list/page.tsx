"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, List, Trash2, ShoppingBag } from "lucide-react";
import { useProfile } from "@/store/profile";
import { useCart } from "@/store/cart";
import { useT } from "@/lib/i18n/useT";
import { cn } from "@/lib/utils";

export default function ShoppingListPage() {
  const { t, formatPrice } = useT();
  const shoppingList = useProfile((s) => s.shoppingList);
  const listView = useProfile((s) => s.listView);
  const setListView = useProfile((s) => s.setListView);
  const removeFromList = useProfile((s) => s.removeFromList);
  const updateListNote = useProfile((s) => s.updateListNote);
  const clearList = useProfile((s) => s.clearList);
  const addItem = useCart((s) => s.addItem);

  function addAll() {
    shoppingList.forEach((item) => {
      addItem({
        productId: item.productId,
        variantId: item.variantId,
        slug: item.slug,
        name: item.name,
        variantName: item.variantName,
        sku: item.sku,
        price: item.price,
        image: item.image,
        maxStock: 99,
      });
    });
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-12 md:px-8 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
            {t("list.items", { n: shoppingList.length })}
          </p>
          <h1 className="mt-2 font-display text-5xl tracking-tight">
            {t("list.title")}
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted">{t("list.subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex border border-line">
            <button
              onClick={() => setListView("list")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em]",
                listView === "list" ? "bg-ink text-ivory" : "text-ink-soft"
              )}
              aria-label={t("list.viewList")}
            >
              <List size={14} /> {t("list.viewList")}
            </button>
            <button
              onClick={() => setListView("icons")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em]",
                listView === "icons" ? "bg-ink text-ivory" : "text-ink-soft"
              )}
              aria-label={t("list.viewIcons")}
            >
              <LayoutGrid size={14} /> {t("list.viewIcons")}
            </button>
          </div>
          {shoppingList.length > 0 && (
            <>
              <button onClick={addAll} className="btn-primary !py-2.5">
                <ShoppingBag size={12} /> {t("list.addAll")}
              </button>
              <button
                onClick={() => clearList()}
                className="btn-ghost !py-2.5 text-danger"
              >
                {t("list.clear")}
              </button>
            </>
          )}
        </div>
      </div>

      {shoppingList.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="font-display text-3xl">{t("list.empty")}</p>
          <p className="mt-2 text-sm text-muted">{t("list.emptySub")}</p>
          <Link href="/shop" className="btn-primary mt-8 inline-flex">
            {t("home.ctaShop")}
          </Link>
        </div>
      ) : listView === "icons" ? (
        <div className="mt-10">
          <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-muted md:hidden">
            {t("list.scroll")}
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory">
            {shoppingList.map((item) => (
              <article
                key={item.id}
                className="w-[160px] shrink-0 snap-start border border-line bg-surface sm:w-[180px]"
              >
                <Link href={`/product/${item.slug}`} className="block">
                  <div className="relative aspect-[3/4] bg-ivory-deep">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="180px"
                    />
                  </div>
                </Link>
                <div className="p-3">
                  <p className="line-clamp-2 text-xs font-medium leading-snug">
                    {item.name}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-muted">
                    {item.variantName}
                  </p>
                  <p className="mt-1 text-sm">{formatPrice(item.price)}</p>
                  <div className="mt-2 flex gap-1">
                    <button
                      className="flex-1 border border-line py-1.5 text-[9px] uppercase tracking-[0.1em] hover:border-ink"
                      onClick={() =>
                        addItem({
                          productId: item.productId,
                          variantId: item.variantId,
                          slug: item.slug,
                          name: item.name,
                          variantName: item.variantName,
                          sku: item.sku,
                          price: item.price,
                          image: item.image,
                          maxStock: 99,
                        })
                      }
                    >
                      +
                    </button>
                    <button
                      className="border border-line px-2 py-1.5 text-muted hover:text-danger"
                      onClick={() => removeFromList(item.id)}
                      aria-label={t("list.remove")}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <ul className="mt-10 max-h-[70vh] space-y-3 overflow-y-auto pr-1">
          {shoppingList.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap gap-4 border border-line bg-surface p-4 sm:flex-nowrap"
            >
              <Link
                href={`/product/${item.slug}`}
                className="relative h-24 w-20 shrink-0 overflow-hidden bg-ivory-deep"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted">
                      {item.variantName} · {item.sku}
                    </p>
                  </div>
                  <p className="font-display text-xl">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <label className="label mt-3">{t("list.note")}</label>
                <input
                  className="field !py-2 text-sm"
                  placeholder={t("list.notePh")}
                  value={item.note}
                  onChange={(e) => updateListNote(item.id, e.target.value)}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    className="btn-ghost !py-2 text-[10px]"
                    onClick={() =>
                      addItem({
                        productId: item.productId,
                        variantId: item.variantId,
                        slug: item.slug,
                        name: item.name,
                        variantName: item.variantName,
                        sku: item.sku,
                        price: item.price,
                        image: item.image,
                        maxStock: 99,
                      })
                    }
                  >
                    {t("product.addToBag")}
                  </button>
                  <button
                    className="text-[10px] uppercase tracking-[0.12em] text-muted hover:text-danger"
                    onClick={() => removeFromList(item.id)}
                  >
                    {t("list.remove")}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
