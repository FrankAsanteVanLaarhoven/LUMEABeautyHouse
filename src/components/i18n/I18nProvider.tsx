"use client";

import { useEffect } from "react";
import { usePrefs } from "@/store/prefs";
import { LOCALES } from "@/lib/i18n/config";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = usePrefs((s) => s.locale);

  useEffect(() => {
    const meta = LOCALES.find((l) => l.code === locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = meta?.dir ?? "ltr";
  }, [locale]);

  return <>{children}</>;
}
