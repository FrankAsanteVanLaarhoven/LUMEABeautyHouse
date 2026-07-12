"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/useT";
import { SocialFooterStrip } from "@/components/social/SocialShare";

export function Footer() {
  const { t } = useT();
  const year = new Date().getFullYear();

  const cols = [
    {
      title: t("footer.shop"),
      links: [
        { href: "/shop?category=makeup", label: t("nav.makeup") },
        { href: "/shop?category=skin", label: t("nav.skin") },
        { href: "/shop?category=hair", label: t("nav.hair") },
        { href: "/shop?category=body", label: t("nav.body") },
        { href: "/shop?category=sets", label: t("nav.sets") },
      ],
    },
    {
      title: t("footer.house"),
      links: [
        { href: "/about", label: t("footer.philosophy") },
        { href: "/#philosophy", label: "Philosophy" },
        { href: "/studio", label: t("footer.studio") },
        { href: "/tutorials", label: t("nav.tutorials") },
        { href: "/platform", label: t("nav.platform") },
        { href: "/account", label: t("nav.account") },
        { href: "/admin", label: t("nav.ops") },
      ],
    },
    {
      title: "Discover",
      links: [
        { href: "/brands", label: "Brand floors" },
        { href: "/quiz", label: t("nav.quiz") },
        { href: "/routines", label: t("nav.routines") },
        { href: "/concerns", label: t("nav.concerns") },
        { href: "/gifts", label: t("nav.gifts") },
        { href: "/glow", label: t("nav.glow") },
        { href: "/community", label: t("nav.community") },
        { href: "/subscribe", label: t("nav.subscribe") },
        { href: "/affiliate", label: t("nav.affiliate") },
      ],
    },
    {
      title: t("footer.care"),
      links: [
        { href: "/checkout", label: t("footer.shipping") },
        { href: "/account", label: t("footer.returns") },
        { href: "/#contact", label: t("footer.contact") },
        { href: "/#sustainability", label: t("footer.sustainability") },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-line bg-ivory-deep">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-3">
            <Link
              href="/"
              className="font-display text-3xl tracking-[0.28em] md:text-4xl"
            >
              {t("brand.name")}
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              {t("footer.blurb")}
            </p>
            <form
              className="mt-8 flex max-w-sm border border-line-strong bg-surface"
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const email = String(fd.get("email") || "");
                await fetch("/api/notify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ type: "newsletter", email }),
                });
                e.currentTarget.reset();
                alert("You're on the list — drops & Glow perks incoming.");
              }}
            >
              <input
                type="email"
                name="email"
                required
                placeholder={t("footer.emailJoin")}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                className="bg-ink px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-ivory transition hover:bg-ink-soft"
              >
                {t("footer.join")}
              </button>
            </form>
            <div className="mt-6">
              <SocialFooterStrip />
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-soft transition hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-1">
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
              {t("footer.domains")}
            </h4>
            <ul className="mt-5 space-y-2 text-sm text-ink-soft">
              <li>lumea.beauty</li>
              <li>getlumea.com</li>
              <li>shoplumea.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-[11px] tracking-[0.04em] text-muted md:flex-row md:items-center">
          <p>{t("brand.copyright", { year })}</p>
          <p className="font-display text-base italic tracking-normal text-ink-soft">
            {t("brand.tagline")}
          </p>
          <p className="uppercase tracking-[0.14em]">{t("brand.crafted")}</p>
        </div>
      </div>
    </footer>
  );
}
