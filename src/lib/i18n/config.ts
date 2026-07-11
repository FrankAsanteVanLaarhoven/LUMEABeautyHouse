export const LOCALES = [
  { code: "en", name: "English", native: "English", dir: "ltr" as const, flag: "🇬🇧" },
  { code: "es", name: "Spanish", native: "Español", dir: "ltr" as const, flag: "🇪🇸" },
  { code: "fr", name: "French", native: "Français", dir: "ltr" as const, flag: "🇫🇷" },
  { code: "de", name: "German", native: "Deutsch", dir: "ltr" as const, flag: "🇩🇪" },
  { code: "pt", name: "Portuguese", native: "Português", dir: "ltr" as const, flag: "🇧🇷" },
  { code: "it", name: "Italian", native: "Italiano", dir: "ltr" as const, flag: "🇮🇹" },
  { code: "nl", name: "Dutch", native: "Nederlands", dir: "ltr" as const, flag: "🇳🇱" },
  { code: "ja", name: "Japanese", native: "日本語", dir: "ltr" as const, flag: "🇯🇵" },
  { code: "ko", name: "Korean", native: "한국어", dir: "ltr" as const, flag: "🇰🇷" },
  { code: "zh", name: "Chinese", native: "中文", dir: "ltr" as const, flag: "🇨🇳" },
  { code: "ar", name: "Arabic", native: "العربية", dir: "rtl" as const, flag: "🇸🇦" },
  { code: "hi", name: "Hindi", native: "हिन्दी", dir: "ltr" as const, flag: "🇮🇳" },
  { code: "tr", name: "Turkish", native: "Türkçe", dir: "ltr" as const, flag: "🇹🇷" },
  { code: "ru", name: "Russian", native: "Русский", dir: "ltr" as const, flag: "🇷🇺" },
  { code: "sv", name: "Swedish", native: "Svenska", dir: "ltr" as const, flag: "🇸🇪" },
  { code: "pl", name: "Polish", native: "Polski", dir: "ltr" as const, flag: "🇵🇱" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", dir: "ltr" as const, flag: "🇮🇩" },
  { code: "th", name: "Thai", native: "ไทย", dir: "ltr" as const, flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt", dir: "ltr" as const, flag: "🇻🇳" },
  { code: "he", name: "Hebrew", native: "עברית", dir: "rtl" as const, flag: "🇮🇱" },
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];

export const DEFAULT_LOCALE: LocaleCode = "en";

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "KRW", symbol: "₩", name: "Korean Won" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

/** Approx rates vs USD for offline/demo; refreshed via API when available */
export const FX_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 151.2,
  CNY: 7.24,
  KRW: 1350,
  INR: 83.5,
  BRL: 5.05,
  CAD: 1.36,
  AUD: 1.53,
  AED: 3.67,
  SAR: 3.75,
  TRY: 32.5,
  RUB: 92.0,
  SEK: 10.5,
  PLN: 3.95,
  IDR: 15800,
  THB: 35.8,
  VND: 25400,
  ILS: 3.7,
};

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/lumeabeauty",
  tiktok: "https://tiktok.com/@lumeabeauty",
  youtube: "https://youtube.com/@lumeabeauty",
  x: "https://x.com/lumeabeauty",
  pinterest: "https://pinterest.com/lumeabeauty",
  facebook: "https://facebook.com/lumeabeauty",
};
