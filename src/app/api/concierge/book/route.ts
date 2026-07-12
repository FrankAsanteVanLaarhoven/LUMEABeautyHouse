import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/concierge-store";
import { getExpert, SESSION_FORMAT_LABELS } from "@/lib/concierge-experts";
import type { SessionFormat } from "@/lib/concierge-experts";
import { sendEmail, appBaseUrl } from "@/lib/email";
import { trackEvent } from "@/lib/brand-analytics";
import { buildPaypalRedirectUrlWithHost } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const expertSlug = String(body.expertSlug || "");
    const format = String(body.format || "one-on-one") as SessionFormat;
    const clientName = String(body.name || body.clientName || "").trim();
    const clientEmail = String(body.email || body.clientEmail || "")
      .trim()
      .toLowerCase();

    if (!clientName || !clientEmail.includes("@")) {
      return NextResponse.json(
        { error: "Name and valid email required" },
        { status: 400 }
      );
    }

    const expert = getExpert(expertSlug);
    if (!expert) {
      return NextResponse.json({ error: "Expert not found" }, { status: 404 });
    }

    const booking = await createBooking({
      expertSlug,
      format,
      clientName,
      clientEmail,
      partySize: Number(body.partySize) || 1,
      eventType: body.eventType ? String(body.eventType) : undefined,
      notes: body.notes ? String(body.notes) : undefined,
    });

    for (const brand of expert.brandSlugs) {
      await trackEvent({
        brandSlug: brand,
        type: "concierge_book",
        meta: `${booking.id}|${format}|${expert.slug}`,
      });
    }

    const base = appBaseUrl(req.url);
    const roomUrl = `${base}/concierge/session/${booking.id}`;

    await sendEmail({
      to: clientEmail,
      subject: `Live session booked · ${expert.name} · $${booking.priceUsd}`,
      html: `<p>Hi ${clientName},</p>
        <p>Your <strong>${SESSION_FORMAT_LABELS[format]}</strong> with <strong>${expert.name}</strong> is confirmed.</p>
        <p>Duration: ${booking.durationMin} min · Party size: ${booking.partySize}<br/>
        Fee: <strong>$${booking.priceUsd}</strong> (expert earns $${booking.expertEarns}; platform $${booking.platformEarns})</p>
        <p>Live room code: <strong>${booking.roomCode}</strong></p>
        <p><a href="${roomUrl}" style="background:#1a1612;color:#faf7f2;padding:12px 18px;text-decoration:none;font-size:12px;letter-spacing:0.1em;text-transform:uppercase">Open live room</a></p>
        <p>Your expert can recommend products from their floors — shopping from the room supports their commission (${booking.productCommissionPct}%).</p>`,
      text: `Booked ${format} with ${expert.name}. Room ${roomUrl} code ${booking.roomCode}. $${booking.priceUsd}`,
      template: "generic",
      meta: { bookingId: booking.id },
    });

    // Optional PayPal payment for the session fee
    let paypalUrl: string | null = null;
    if (body.payWithPaypal !== false) {
      paypalUrl = buildPaypalRedirectUrlWithHost({
        amount: booking.priceUsd,
        itemName: `LUMÉA Concierge · ${expert.name} · ${SESSION_FORMAT_LABELS[format]}`,
        invoice: `CONC-${booking.id}`,
        returnUrl: `${roomUrl}?paid=1`,
        cancelUrl: `${base}/concierge?cancelled=1`,
        custom: booking.id,
      });
    }

    return NextResponse.json({
      ok: true,
      booking,
      roomUrl,
      paypalUrl,
      message: "Session booked. Check email for your live room link.",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Booking failed" },
      { status: 400 }
    );
  }
}
