import { NextRequest, NextResponse } from "next/server";
import { addLead } from "@/lib/notify-store";
import { getLiveEvent } from "@/lib/experiences";
import { sendEmail, appBaseUrl } from "@/lib/email";
import { trackEvent } from "@/lib/brand-analytics";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const eventId = String(body.eventId || "");
  const event = getLiveEvent(eventId);
  if (!email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  await addLead({
    type: "newsletter",
    email,
    productSlug: `live-rsvp:${eventId}`,
  });

  await trackEvent({
    brandSlug: event.guestBrandSlug || "lumea",
    type: "live_rsvp",
    meta: eventId,
  });

  const base = appBaseUrl(req.url);
  await sendEmail({
    to: email,
    subject: `RSVP · ${event.title}`,
    html: `<p>You're on the list for <strong>${event.title}</strong>.</p><p>${event.when} · ${event.durationMin} min · Host ${event.host}${event.guestBrand ? ` · Guest ${event.guestBrand}` : ""}</p><p><a href="${base}/live/${event.id}">Open event room</a></p>`,
    text: `RSVP confirmed for ${event.title} — ${event.when}`,
    template: "generic",
    meta: { eventId },
  });

  return NextResponse.json({ ok: true, event: { id: event.id, title: event.title } });
}
