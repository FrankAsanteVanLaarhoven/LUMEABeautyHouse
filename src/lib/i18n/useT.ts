"use client";

import { useCallback, useMemo } from "react";
import { usePrefs } from "@/store/prefs";
import { translate, type MessageKey } from "./messages";
import {
  CURRENCIES,
  FX_RATES,
  LOCALES,
  type CurrencyCode,
  type LocaleCode,
} from "./config";

export function useT() {
  const locale = usePrefs((s) => s.locale);
  const currency = usePrefs((s) => s.currency);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale]
  );

  const formatPrice = useCallback(
    (usdAmount: number) => {
      const rate = FX_RATES[currency] ?? 1;
      const converted = usdAmount * rate;
      const meta = CURRENCIES.find((c) => c.code === currency);
      try {
        return new Intl.NumberFormat(localeToBcp47(locale), {
          style: "currency",
          currency,
          maximumFractionDigits: currency === "JPY" || currency === "KRW" || currency === "VND" || currency === "IDR" ? 0 : 2,
        }).format(converted);
      } catch {
        return `${meta?.symbol ?? ""}${converted.toFixed(2)}`;
      }
    },
    [currency, locale]
  );

  const dir = useMemo(() => {
    return LOCALES.find((l) => l.code === locale)?.dir ?? "ltr";
  }, [locale]);

  return { t, locale, currency, formatPrice, dir };
}

export function localeToBcp47(code: LocaleCode): string {
  const map: Record<string, string> = {
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    pt: "pt-BR",
    it: "it-IT",
    nl: "nl-NL",
    ja: "ja-JP",
    ko: "ko-KR",
    zh: "zh-CN",
    ar: "ar-SA",
    hi: "hi-IN",
    tr: "tr-TR",
    ru: "ru-RU",
    sv: "sv-SE",
    pl: "pl-PL",
    id: "id-ID",
    th: "th-TH",
    vi: "vi-VN",
    he: "he-IL",
  };
  return map[code] || "en-US";
}

export function convertFromUsd(usd: number, currency: CurrencyCode) {
  return usd * (FX_RATES[currency] ?? 1);
}
