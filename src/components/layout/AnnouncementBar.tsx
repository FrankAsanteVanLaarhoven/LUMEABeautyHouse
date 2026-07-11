"use client";

import { useT } from "@/lib/i18n/useT";

export function AnnouncementBar() {
  const { t } = useT();
  const messages = [
    t("announce.ship"),
    t("announce.lume15"),
    t("announce.lume25"),
    t("announce.veil"),
  ];
  const loop = [...messages, ...messages];
  return (
    <div className="relative z-[60] h-9 overflow-hidden bg-ink text-ivory">
      <div className="animate-marquee flex h-full w-max items-center gap-12 whitespace-nowrap px-4">
        {loop.map((msg, i) => (
          <span
            key={i}
            className="text-[10px] font-medium uppercase tracking-[0.22em] opacity-90"
          >
            {msg}
            <span className="ml-12 inline-block h-1 w-1 rounded-full bg-champagne align-middle opacity-60" />
          </span>
        ))}
      </div>
    </div>
  );
}
