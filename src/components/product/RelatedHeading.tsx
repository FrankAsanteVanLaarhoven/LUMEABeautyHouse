"use client";

import { useT } from "@/lib/i18n/useT";

export function RelatedHeading() {
  const { t } = useT();
  return (
    <h2 className="font-display text-3xl md:text-4xl">
      {t("product.youMayLike")}
    </h2>
  );
}
