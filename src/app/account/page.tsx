"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ListTodo,
  Sparkles,
  Wallet,
  Package,
  User,
} from "lucide-react";
import type { Order } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useT } from "@/lib/i18n/useT";
import { useProfile } from "@/store/profile";
import { usePrefs } from "@/store/prefs";
import { cn } from "@/lib/utils";

const CONCERNS = [
  "dryness",
  "oil",
  "acne",
  "aging",
  "redness",
  "pores",
] as const;

const CATS = ["makeup", "skin", "hair", "body", "sets"] as const;

function AccountInner() {
  const { t, formatPrice } = useT();
  const params = useSearchParams();
  const orderNum = params.get("order");
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState(false);
  const [flash, setFlash] = useState("");

  const profile = useProfile((s) => s.profile);
  const walletTx = useProfile((s) => s.walletTx);
  const createProfile = useProfile((s) => s.createProfile);
  const updateProfile = useProfile((s) => s.updateProfile);
  const clearProfile = useProfile((s) => s.clearProfile);
  const topUp = useProfile((s) => s.topUp);
  const shoppingList = useProfile((s) => s.shoppingList);

  const skinType = usePrefs((s) => s.skinType);
  const undertone = usePrefs((s) => s.undertone);
  const skinDepth = usePrefs((s) => s.skinDepth);
  const setSkinProfile = usePrefs((s) => s.setSkinProfile);
  const liked = usePrefs((s) => s.likedProducts);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []));
  }, []);

  useEffect(() => {
    if (params.get("order") === null && window.location.hash === "#wallet") {
      document.getElementById("wallet")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [params, profile]);

  const myOrders = profile
    ? orders.filter(
        (o) => o.email.toLowerCase() === profile.email.toLowerCase()
      )
    : orders.slice(0, 3);

  const successOrder = orderNum
    ? orders.find((o) => o.orderNumber === orderNum)
    : null;

  function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const concerns = CONCERNS.filter((c) => fd.get(`concern_${c}`) === "on");
    const favoriteCategories = CATS.filter((c) => fd.get(`cat_${c}`) === "on");
    createProfile({
      firstName: String(fd.get("firstName")),
      lastName: String(fd.get("lastName")),
      email: String(fd.get("email")),
      phone: String(fd.get("phone") || ""),
      bio: String(fd.get("bio") || ""),
      birthday: String(fd.get("birthday") || ""),
      country: String(fd.get("country") || ""),
      city: String(fd.get("city") || ""),
      skinType: String(fd.get("skinType") || skinType),
      undertone: String(fd.get("undertone") || undertone),
      skinDepth: String(fd.get("skinDepth") || skinDepth),
      concerns: [...concerns],
      favoriteCategories: [...favoriteCategories],
      notifyEmail: fd.get("notifyEmail") === "on",
      notifySms: fd.get("notifySms") === "on",
    });
    setSkinProfile({
      skinType: String(fd.get("skinType") || skinType),
      undertone: String(fd.get("undertone") || undertone),
      skinDepth: String(fd.get("skinDepth") || skinDepth),
    });
    setFlash(t("profile.created"));
    setEditing(false);
  }

  function onUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;
    const fd = new FormData(e.currentTarget);
    const concerns = CONCERNS.filter((c) => fd.get(`concern_${c}`) === "on");
    const favoriteCategories = CATS.filter((c) => fd.get(`cat_${c}`) === "on");
    updateProfile({
      firstName: String(fd.get("firstName")),
      lastName: String(fd.get("lastName")),
      email: String(fd.get("email")),
      phone: String(fd.get("phone") || ""),
      bio: String(fd.get("bio") || ""),
      birthday: String(fd.get("birthday") || ""),
      country: String(fd.get("country") || ""),
      city: String(fd.get("city") || ""),
      skinType: String(fd.get("skinType")),
      undertone: String(fd.get("undertone")),
      skinDepth: String(fd.get("skinDepth")),
      concerns: [...concerns],
      favoriteCategories: [...favoriteCategories],
      notifyEmail: fd.get("notifyEmail") === "on",
      notifySms: fd.get("notifySms") === "on",
    });
    setSkinProfile({
      skinType: String(fd.get("skinType")),
      undertone: String(fd.get("undertone")),
      skinDepth: String(fd.get("skinDepth")),
    });
    setEditing(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
      {orderNum && (
        <div className="mb-10 border border-ok/30 bg-ok/5 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 text-ok" size={22} />
            <div>
              <h2 className="font-display text-2xl">{t("account.confirmed")}</h2>
              <p className="mt-1 text-sm text-muted">
                {t("account.queued", { num: orderNum })}
              </p>
              {successOrder && (
                <p className="mt-2 text-sm">
                  {formatPrice(successOrder.total)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {flash && (
        <div className="mb-6 border border-champagne/40 bg-champagne/15 px-4 py-3 text-sm">
          {flash}
        </div>
      )}

      {!profile || editing ? (
        <div>
          <h1 className="font-display text-5xl tracking-tight">
            {profile ? t("profile.edit") : t("profile.create")}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            {t("profile.subtitle")}
          </p>
          <form
            onSubmit={profile ? onUpdate : onCreate}
            className="mt-10 space-y-8"
          >
            <section className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">{t("profile.firstName")}</label>
                <input
                  name="firstName"
                  required
                  defaultValue={profile?.firstName}
                  className="field"
                />
              </div>
              <div>
                <label className="label">{t("profile.lastName")}</label>
                <input
                  name="lastName"
                  required
                  defaultValue={profile?.lastName}
                  className="field"
                />
              </div>
              <div>
                <label className="label">{t("profile.email")}</label>
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue={profile?.email}
                  className="field"
                />
              </div>
              <div>
                <label className="label">{t("profile.phone")}</label>
                <input
                  name="phone"
                  defaultValue={profile?.phone}
                  className="field"
                />
              </div>
              <div>
                <label className="label">{t("profile.city")}</label>
                <input
                  name="city"
                  defaultValue={profile?.city}
                  className="field"
                />
              </div>
              <div>
                <label className="label">{t("profile.country")}</label>
                <input
                  name="country"
                  defaultValue={profile?.country}
                  className="field"
                />
              </div>
              <div>
                <label className="label">{t("profile.birthday")}</label>
                <input
                  name="birthday"
                  type="date"
                  defaultValue={profile?.birthday}
                  className="field"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t("profile.bio")}</label>
                <textarea
                  name="bio"
                  defaultValue={profile?.bio}
                  className="field min-h-[80px]"
                />
              </div>
            </section>

            <section>
              <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                {t("profile.skin")}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="label">{t("studio.skinType")}</label>
                  <select
                    name="skinType"
                    className="field"
                    defaultValue={profile?.skinType || skinType}
                  >
                    {["normal", "dry", "oily", "combination", "sensitive"].map(
                      (s) => (
                        <option key={s} value={s}>
                          {t(`studio.type.${s}` as "studio.type.normal")}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="label">{t("studio.undertone")}</label>
                  <select
                    name="undertone"
                    className="field"
                    defaultValue={profile?.undertone || undertone}
                  >
                    {["cool", "warm", "neutral", "olive"].map((s) => (
                      <option key={s} value={s}>
                        {t(`studio.under.${s}` as "studio.under.cool")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">{t("studio.skinTone")}</label>
                  <select
                    name="skinDepth"
                    className="field"
                    defaultValue={profile?.skinDepth || skinDepth}
                  >
                    {["fair", "light", "medium", "tan", "deep", "rich"].map(
                      (s) => (
                        <option key={s} value={s}>
                          {t(`studio.depth.${s}` as "studio.depth.fair")}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <p className="label mt-6">{t("profile.concerns")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {CONCERNS.map((c) => (
                  <label
                    key={c}
                    className="flex cursor-pointer items-center gap-2 border border-line px-3 py-2 text-xs"
                  >
                    <input
                      type="checkbox"
                      name={`concern_${c}`}
                      defaultChecked={profile?.concerns?.includes(c)}
                    />
                    {t(`profile.concern.${c}` as "profile.concern.dryness")}
                  </label>
                ))}
              </div>
              <p className="label mt-6">{t("profile.favorites")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {CATS.map((c) => (
                  <label
                    key={c}
                    className="flex cursor-pointer items-center gap-2 border border-line px-3 py-2 text-xs capitalize"
                  >
                    <input
                      type="checkbox"
                      name={`cat_${c}`}
                      defaultChecked={profile?.favoriteCategories?.includes(c)}
                    />
                    {t(`nav.${c}` as "nav.makeup")}
                  </label>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="notifyEmail"
                    defaultChecked={profile?.notifyEmail ?? true}
                  />
                  {t("profile.notifyEmail")}
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="notifySms"
                    defaultChecked={profile?.notifySms ?? false}
                  />
                  {t("profile.notifySms")}
                </label>
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn-primary">
                {t("profile.save")}
              </button>
              {profile && (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setEditing(false)}
                >
                  {t("common.cancel")}
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full font-display text-2xl text-ivory"
                style={{ background: profile.avatarHue }}
              >
                {profile.firstName[0]}
                {profile.lastName[0]}
              </div>
              <div>
                <h1 className="font-display text-4xl tracking-tight md:text-5xl">
                  {t("profile.welcome", { name: profile.firstName })}
                </h1>
                <p className="mt-1 text-sm text-muted">{profile.email}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted">
                  {t(`studio.type.${profile.skinType}` as "studio.type.normal")}{" "}
                  ·{" "}
                  {t(
                    `studio.under.${profile.undertone}` as "studio.under.cool"
                  )}{" "}
                  ·{" "}
                  {t(
                    `studio.depth.${profile.skinDepth}` as "studio.depth.fair"
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-ghost !py-2" onClick={() => setEditing(true)}>
                {t("profile.edit")}
              </button>
              <button
                className="text-[10px] uppercase tracking-[0.14em] text-muted hover:text-danger"
                onClick={() => {
                  if (confirm(t("profile.signOut") + "?")) clearProfile();
                }}
              >
                {t("profile.signOut")}
              </button>
            </div>
          </div>

          {profile.bio && (
            <p className="mt-6 max-w-xl text-sm text-ink-soft">{profile.bio}</p>
          )}

          {/* Experiences */}
          <section className="mt-12">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              {t("profile.experiences")}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  href: "/studio",
                  icon: Sparkles,
                  label: t("profile.tryOn"),
                  meta: t("nav.studio"),
                },
                {
                  href: "/list",
                  icon: ListTodo,
                  label: t("nav.list"),
                  meta: t("list.items", { n: shoppingList.length }),
                },
                {
                  href: "#wallet",
                  icon: Wallet,
                  label: t("wallet.title"),
                  meta: formatPrice(profile.walletBalance),
                },
                {
                  href: "/shop",
                  icon: Package,
                  label: t("nav.shopAll"),
                  meta: t("nav.likes") + ` · ${liked.length}`,
                },
              ].map((card) => (
                <Link
                  key={card.label}
                  href={card.href}
                  className="group border border-line bg-surface p-5 transition hover:border-ink"
                >
                  <card.icon
                    size={18}
                    className="text-champagne"
                    strokeWidth={1.5}
                  />
                  <p className="mt-3 text-sm font-medium">{card.label}</p>
                  <p className="mt-1 text-xs text-muted">{card.meta}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Wallet */}
          <section id="wallet" className="mt-14 scroll-mt-36">
            <div className="border border-line bg-ink p-6 text-ivory md:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-champagne">
                    {t("wallet.title")}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-ivory/50">
                    {t("wallet.balance")}
                  </p>
                  <p className="font-display text-5xl">
                    {formatPrice(profile.walletBalance)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => topUp(amt)}
                      className="border border-ivory/30 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] transition hover:bg-ivory hover:text-ink"
                    >
                      {t(`wallet.add${amt}` as "wallet.add25")}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-8 border-t border-ivory/15 pt-6">
                <p className="text-[10px] uppercase tracking-[0.16em] text-ivory/50">
                  {t("wallet.history")}
                </p>
                <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto">
                  {walletTx.length === 0 && (
                    <li className="text-sm text-ivory/50">{t("wallet.empty")}</li>
                  )}
                  {walletTx.map((tx) => (
                    <li
                      key={tx.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-ivory/70">
                        {t(`wallet.${tx.type}` as "wallet.topup")} · {tx.note}
                      </span>
                      <span
                        className={cn(
                          "tabular-nums",
                          tx.amount >= 0 ? "text-champagne" : "text-ivory"
                        )}
                      >
                        {tx.amount >= 0 ? "+" : ""}
                        {formatPrice(Math.abs(tx.amount))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Orders */}
          <section className="mt-14">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              {t("profile.orders")}
            </h2>
            <div className="mt-4 space-y-3">
              {myOrders.length === 0 && (
                <p className="text-sm text-muted">{t("account.none")}</p>
              )}
              {myOrders.map((o) => (
                <div key={o.id} className="border border-line bg-surface p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{o.orderNumber}</p>
                      <p className="mt-1 text-xs text-muted">
                        {formatDate(o.createdAt)} · {o.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl">
                        {formatPrice(o.total)}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-muted">
                        {o.status} · {o.fulfillmentStatus}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {!profile && !editing && (
        <p className="mt-6 flex items-center gap-2 text-sm text-muted">
          <User size={14} /> {t("profile.noProfile")}
        </p>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-muted">Loading...</div>
      }
    >
      <AccountInner />
    </Suspense>
  );
}
