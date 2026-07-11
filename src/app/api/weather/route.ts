import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat") || "40.71";
  const lon = searchParams.get("lon") || "-74.0";

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error("weather failed");
    const data = await res.json();

    let city = "Your area";
    try {
      const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`,
        { next: { revalidate: 86400 } }
      );
      if (geo.ok) {
        const g = await geo.json();
        city =
          g?.results?.[0]?.name ||
          g?.results?.[0]?.admin1 ||
          city;
      }
    } catch {
      /* keep default */
    }

    return NextResponse.json({
      temp: data.current.temperature_2m,
      feels: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      wind: data.current.wind_speed_10m,
      code: data.current.weather_code,
      city,
      daily: (data.daily.time as string[]).map((date: string, i: number) => ({
        date,
        max: data.daily.temperature_2m_max[i],
        min: data.daily.temperature_2m_min[i],
        code: data.daily.weather_code[i],
      })),
    });
  } catch {
    return NextResponse.json({
      temp: 22,
      feels: 21,
      humidity: 55,
      wind: 8,
      code: 1,
      city: "Local",
      daily: [0, 1, 2].map((i) => ({
        date: new Date(Date.now() + i * 86400000).toISOString().slice(0, 10),
        max: 24 - i,
        min: 16 - i,
        code: 1,
      })),
    });
  }
}
