"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  ListTodo,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { useProfile } from "@/store/profile";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/lib/i18n/useT";

export function Header() {
  const { t, formatPrice } = useT();
  const count = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);
  const profile = useProfile((s) => s.profile);
  const listCount = useProfile((s) => s.shoppingList.length);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const nav = [
    { href: "/shop?category=makeup", label: t("nav.makeup") },
    { href: "/shop?category=skin", label: t("nav.skin") },
    { href: "/shop?category=hair", label: t("nav.hair") },
    { href: "/shop?category=body", label: t("nav.body") },
    { href: "/shop?category=tools", label: t("nav.tools") },
    { href: "/shop?category=sets", label: t("nav.sets") },
    { href: "/brands", label: "Brands" },
    { href: "/quiz", label: t("nav.quiz") },
    { href: "/concerns", label: t("nav.concerns") },
    { href: "/routines", label: t("nav.routines") },
    { href: "/gifts", label: t("nav.gifts") },
    { href: "/community", label: t("nav.community") },
    { href: "/studio", label: t("nav.studio") },
    { href: "/tutorials", label: t("nav.tutorials") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-line bg-ivory/95 backdrop-blur-xl shadow-sm"
            : "bg-ivory/85 backdrop-blur-md"
        )}
      >
        {/* Row 1: brand + utilities */}
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-4 md:h-16 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              className="shrink-0 p-1 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label={t("nav.menu")}
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <Link
              href="/"
              className="shrink-0 font-display text-[26px] tracking-[0.22em] md:text-[30px]"
            >
              {t("brand.name")}
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
            <button
              className="p-2 text-ink-soft transition hover:text-ink"
              onClick={() => setSearchOpen(true)}
              aria-label={t("nav.search")}
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link
              href="/list"
              className="relative p-2 text-ink-soft transition hover:text-ink"
              aria-label={t("nav.list")}
              title={t("nav.list")}
            >
              <ListTodo size={18} strokeWidth={1.5} />
              {listCount > 0 && (
                <span className="absolute right-0 top-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-champagne px-0.5 text-[8px] font-semibold text-ink">
                  {listCount}
                </span>
              )}
            </Link>
            <Link
              href="/account#wallet"
              className="hidden items-center gap-1 p-2 text-ink-soft transition hover:text-ink sm:inline-flex"
              aria-label={t("nav.wallet")}
              title={profile ? formatPrice(profile.walletBalance) : t("nav.wallet")}
            >
              <Wallet size={18} strokeWidth={1.5} />
              {profile && (
                <span className="hidden text-[10px] font-medium tabular-nums tracking-wide text-muted xl:inline">
                  {formatPrice(profile.walletBalance)}
                </span>
              )}
            </Link>
            <Link
              href="/studio"
              className="hidden p-2 text-champagne transition hover:text-ink md:inline-flex"
              aria-label={t("nav.studio")}
              title={t("nav.studio")}
            >
              <Sparkles size={18} strokeWidth={1.5} />
            </Link>
            <Link
              href="/account"
              className="relative p-2 text-ink-soft transition hover:text-ink"
              aria-label={t("nav.account")}
            >
              {profile ? (
                <span
                  className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-[9px] font-semibold text-ivory"
                  style={{ background: profile.avatarHue }}
                  title={profile.firstName}
                >
                  {profile.firstName[0]?.toUpperCase()}
                </span>
              ) : (
                <User size={18} strokeWidth={1.5} />
              )}
            </Link>
            <Link
              href="/brand"
              className="hidden px-1 text-[10px] uppercase tracking-[0.14em] text-champagne transition hover:text-ink xl:inline"
              title="Brand portal"
            >
              Brands
            </Link>
            <Link
              href="/admin"
              className="hidden px-1 text-[10px] uppercase tracking-[0.14em] text-muted transition hover:text-ink xl:inline"
            >
              {t("nav.ops")}
            </Link>
            <button
              onClick={openCart}
              className="relative p-2 text-ink-soft transition hover:text-ink"
              aria-label={t("nav.cart")}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-medium text-ivory">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: full-width nav — never overlaps logo */}
        <nav className="hidden border-t border-line/80 lg:block">
          <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-1 overflow-x-auto px-4 py-2.5 md:px-8 md:gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 whitespace-nowrap px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft transition-colors hover:bg-sand/40 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <span className="mx-1 h-3 w-px shrink-0 bg-line" />
            <Link
              href="/shop"
              className="shrink-0 whitespace-nowrap px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:bg-sand/40"
            >
              {t("nav.shopAll")}
            </Link>
            <Link
              href="/list"
              className="shrink-0 whitespace-nowrap px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft transition-colors hover:bg-sand/40 hover:text-ink"
            >
              {t("nav.list")}
            </Link>
            <Link
              href="/glow"
              className="shrink-0 whitespace-nowrap px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-champagne transition-colors hover:bg-sand/40"
            >
              {t("nav.glow")}
            </Link>
            <Link
              href="/platform"
              className="shrink-0 whitespace-nowrap px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-champagne transition-colors hover:bg-sand/40"
            >
              {t("nav.platform")}
            </Link>
          </div>
        </nav>

        {/* Tablet: scrollable single-row category strip */}
        <nav className="border-t border-line/80 lg:hidden">
          <div className="flex gap-1 overflow-x-auto px-3 py-2 scrollbar-none">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="flex h-full w-[86%] max-w-sm flex-col bg-ivory p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display text-2xl tracking-[0.24em]">
                  {t("brand.name")}
                </span>
                <button onClick={() => setMobileOpen(false)} aria-label={t("nav.close")}>
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-4 overflow-y-auto">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-3xl tracking-tight text-ink"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-3xl tracking-tight text-ink"
                >
                  {t("nav.shopAll")}
                </Link>
                <div className="mt-6 space-y-3 border-t border-line pt-6">
                  <Link
                    href="/quiz"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm uppercase tracking-[0.16em] text-muted"
                  >
                    {t("nav.quiz")}
                  </Link>
                  <Link
                    href="/concerns"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm uppercase tracking-[0.16em] text-muted"
                  >
                    {t("nav.concerns")}
                  </Link>
                  <Link
                    href="/routines"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm uppercase tracking-[0.16em] text-muted"
                  >
                    {t("nav.routines")}
                  </Link>
                  <Link
                    href="/gifts"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm uppercase tracking-[0.16em] text-muted"
                  >
                    {t("nav.gifts")}
                  </Link>
                  <Link
                    href="/glow"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm uppercase tracking-[0.16em] text-champagne"
                  >
                    {t("nav.glow")}
                  </Link>
                  <Link
                    href="/community"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm uppercase tracking-[0.16em] text-muted"
                  >
                    {t("nav.community")}
                  </Link>
                  <Link
                    href="/subscribe"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm uppercase tracking-[0.16em] text-muted"
                  >
                    {t("nav.subscribe")}
                  </Link>
                  <Link
                    href="/affiliate"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm uppercase tracking-[0.16em] text-muted"
                  >
                    {t("nav.affiliate")}
                  </Link>
                  <Link
                    href="/tutorials"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm uppercase tracking-[0.16em] text-muted"
                  >
                    {t("nav.tutorials")}
                  </Link>
                  <Link
                    href="/platform"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm uppercase tracking-[0.16em] text-muted"
                  >
                    {t("nav.platform")}
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-muted"
                  >
                    <User size={16} /> {t("nav.profile")}
                  </Link>
                  <Link
                    href="/list"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-muted"
                  >
                    <ListTodo size={16} /> {t("nav.list")}
                  </Link>
                  <Link
                    href="/account#wallet"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-muted"
                  >
                    <Wallet size={16} /> {t("nav.wallet")}
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-muted"
                  >
                    <Heart size={16} /> {t("nav.likes")}
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm uppercase tracking-[0.16em] text-muted"
                  >
                    {t("nav.ops")}
                  </Link>
                </div>
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/50 px-4 pt-28 backdrop-blur-md"
            onClick={() => setSearchOpen(false)}
          >
            <motion.form
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              className="w-full max-w-xl border border-line bg-ivory p-2 shadow-soft"
              onClick={(e) => e.stopPropagation()}
              action="/shop"
            >
              <div className="flex items-center gap-3 px-3">
                <Search size={18} className="text-muted" strokeWidth={1.5} />
                <input
                  name="q"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("nav.searchPlaceholder")}
                  className="w-full bg-transparent py-4 text-base outline-none placeholder:text-muted"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-muted"
                  aria-label={t("nav.close")}
                >
                  <X size={18} />
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
