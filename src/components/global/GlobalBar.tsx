"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar as CalIcon,
  CloudSun,
  Coins,
  Globe2,
  Clock,
  ChevronDown,
  X,
} from "lucide-react";
import { LOCALES, CURRENCIES, type LocaleCode, type CurrencyCode } from "@/lib/i18n/config";
import { usePrefs } from "@/store/prefs";
import { useT } from "@/lib/i18n/useT";
import { cn } from "@/lib/utils";

type Panel = "lang" | "currency" | "clock" | "calendar" | "weather" | null;

const CITIES = [
  { id: "local", label: "Local", offset: null as number | null },
  { id: "nyc", label: "New York", offset: -4 },
  { id: "lon", label: "London", offset: 1 },
  { id: "par", label: "Paris", offset: 2 },
  { id: "dxb", label: "Dubai", offset: 4 },
  { id: "tyo", label: "Tokyo", offset: 9 },
  { id: "syd", label: "Sydney", offset: 10 },
  { id: "sao", label: "São Paulo", offset: -3 },
];

export function GlobalBar() {
  const { t } = useT();
  const locale = usePrefs((s) => s.locale);
  const currency = usePrefs((s) => s.currency);
  const setLocale = usePrefs((s) => s.setLocale);
  const setCurrency = usePrefs((s) => s.setCurrency);
  const [panel, setPanel] = useState<Panel>(null);
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<{
    temp: number;
    feels: number;
    humidity: number;
    wind: number;
    code: number;
    city: string;
    daily: { date: string; max: number; min: number; code: number }[];
  } | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadWeather() {
      try {
        const pos = await new Promise<GeolocationPosition | null>((resolve) => {
          if (!navigator.geolocation) return resolve(null);
          navigator.geolocation.getCurrentPosition(
            (p) => resolve(p),
            () => resolve(null),
            { timeout: 5000 }
          );
        });
        const lat = pos?.coords.latitude ?? 40.71;
        const lon = pos?.coords.longitude ?? -74.0;
        const res = await fetch(
          `/api/weather?lat=${lat}&lon=${lon}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setWeather(data);
      } catch {
        /* offline fallback */
      }
    }
    loadWeather();
    return () => {
      cancelled = true;
    };
  }, []);

  const localeMeta = LOCALES.find((l) => l.code === locale)!;
  const currencyMeta = CURRENCIES.find((c) => c.code === currency)!;

  const calDays = useMemo(() => buildMonth(now), [now]);

  function toggle(p: Panel) {
    setPanel((cur) => (cur === p ? null : p));
  }

  return (
    <div className="relative z-[55] border-b border-line bg-ivory-deep/90 text-ink backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 px-3 py-1.5 md:px-8">
        <div className="flex flex-wrap items-center gap-1">
          <BarBtn
            active={panel === "lang"}
            onClick={() => toggle("lang")}
            icon={<Globe2 size={12} />}
            label={`${localeMeta.flag} ${localeMeta.native}`}
          />
          <BarBtn
            active={panel === "currency"}
            onClick={() => toggle("currency")}
            icon={<Coins size={12} />}
            label={`${currencyMeta.symbol} ${currencyMeta.code}`}
          />
          <BarBtn
            active={panel === "clock"}
            onClick={() => toggle("clock")}
            icon={<Clock size={12} />}
            label={now.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <BarBtn
            active={panel === "calendar"}
            onClick={() => toggle("calendar")}
            icon={<CalIcon size={12} />}
            label={now.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          />
          <BarBtn
            active={panel === "weather"}
            onClick={() => toggle("weather")}
            icon={<CloudSun size={12} />}
            label={
              weather
                ? `${Math.round(weather.temp)}° · ${weather.city}`
                : t("util.weather")
            }
          />
        </div>
        <p className="hidden text-[10px] uppercase tracking-[0.14em] text-muted sm:block">
          {t("brand.light")}
        </p>
      </div>

      {panel && (
        <div className="absolute left-0 right-0 top-full z-[60] border-b border-line bg-ivory shadow-soft">
          <div className="mx-auto max-w-[1440px] px-4 py-4 md:px-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
                {panel === "lang" && t("util.selectLang")}
                {panel === "currency" && t("util.selectCurrency")}
                {panel === "clock" && t("util.clock")}
                {panel === "calendar" && t("util.calendar")}
                {panel === "weather" && t("util.weather")}
              </p>
              <button onClick={() => setPanel(null)} aria-label={t("nav.close")}>
                <X size={14} />
              </button>
            </div>

            {panel === "lang" && (
              <div className="grid max-h-64 grid-cols-2 gap-1 overflow-y-auto sm:grid-cols-4 md:grid-cols-5">
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLocale(l.code as LocaleCode);
                      setPanel(null);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-sand/50",
                      locale === l.code && "bg-ink text-ivory"
                    )}
                  >
                    <span>{l.flag}</span>
                    <span className="truncate">{l.native}</span>
                  </button>
                ))}
              </div>
            )}

            {panel === "currency" && (
              <div className="grid max-h-64 grid-cols-2 gap-1 overflow-y-auto sm:grid-cols-4 md:grid-cols-5">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code as CurrencyCode);
                      setPanel(null);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-sand/50",
                      currency === c.code && "bg-ink text-ivory"
                    )}
                  >
                    <span className="w-8 font-medium">{c.symbol}</span>
                    <span>{c.code}</span>
                    <span className="truncate text-xs opacity-60">{c.name}</span>
                  </button>
                ))}
              </div>
            )}

            {panel === "clock" && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {CITIES.map((c) => {
                  const d =
                    c.offset === null
                      ? now
                      : new Date(
                          now.getTime() +
                            (c.offset * 60 + now.getTimezoneOffset()) *
                              60000
                        );
                  return (
                    <div
                      key={c.id}
                      className="border border-line bg-surface px-3 py-3"
                    >
                      <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                        {c.label}
                      </p>
                      <p className="mt-1 font-display text-2xl tabular-nums">
                        {d.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {d.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {panel === "calendar" && (
              <div className="max-w-sm">
                <p className="mb-3 font-display text-2xl">
                  {now.toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-muted">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d} className="py-1">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calDays.map((d, i) => (
                    <div
                      key={i}
                      className={cn(
                        "aspect-square flex items-center justify-center text-sm",
                        d &&
                          d.getDate() === now.getDate() &&
                          "bg-ink text-ivory",
                        d &&
                          d.getDate() !== now.getDate() &&
                          "hover:bg-sand/60",
                        !d && "opacity-0"
                      )}
                    >
                      {d?.getDate()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {panel === "weather" && (
              <div>
                {!weather ? (
                  <p className="text-sm text-muted">{t("util.locating")}</p>
                ) : (
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                        {weather.city}
                      </p>
                      <p className="font-display text-5xl">
                        {Math.round(weather.temp)}°
                      </p>
                      <p className="text-sm text-muted">
                        {weatherCodeLabel(weather.code)}
                      </p>
                      <div className="mt-3 flex gap-4 text-xs text-muted">
                        <span>
                          {t("util.feelsLike")} {Math.round(weather.feels)}°
                        </span>
                        <span>
                          {t("util.humidity")} {weather.humidity}%
                        </span>
                        <span>
                          {t("util.wind")} {Math.round(weather.wind)} km/h
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-muted">
                        {t("util.forecast")}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {weather.daily.map((d) => (
                          <div
                            key={d.date}
                            className="border border-line bg-surface px-3 py-2 text-center"
                          >
                            <p className="text-[10px] text-muted">
                              {new Date(d.date).toLocaleDateString(undefined, {
                                weekday: "short",
                              })}
                            </p>
                            <p className="mt-1 text-sm font-medium">
                              {Math.round(d.max)}° / {Math.round(d.min)}°
                            </p>
                            <p className="text-[10px] text-muted">
                              {weatherCodeLabel(d.code)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BarBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.1em] transition",
        active ? "bg-ink text-ivory" : "text-ink-soft hover:bg-sand/50"
      )}
    >
      {icon}
      <span className="max-w-[120px] truncate">{label}</span>
      <ChevronDown size={10} className={cn(active && "rotate-180")} />
    </button>
  );
}

function buildMonth(now: Date) {
  const y = now.getFullYear();
  const m = now.getMonth();
  const first = new Date(y, m, 1);
  const start = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < start; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function weatherCodeLabel(code: number) {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Fog";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 99) return "Thunder";
  return "—";
}
