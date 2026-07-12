import { NextRequest, NextResponse } from "next/server";
import { addLead } from "@/lib/notify-store";
import { getConciergeSlot } from "@/lib/experiences";
import { sendEmail, appBaseUrl } from "@/lib/email";
import { trackEvent } from "@/lib/brand-analytics";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  if (!email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const slotId = String(body.slotId || "");
  const slot = getConciergeSlot(slotId);
  const name = String(body.name || "Guest");
  const topic = String(body.topic || "shade-match");
  const notes = String(body.notes || "");

  await addLead({
    type: "newsletter",
    email,
    productSlug: `concierge:${slotId}:${topic}`,
  });

  await trackEvent({
    brandSlug: "lumea",
    type: "concierge_book",
    meta: `${slotId}|${topic}|${name}`,
  });

  const when = slot?.when || "TBD";
  const base = appBaseUrl(req.url);
  await sendEmail({
    to: email,
    subject: `Beauty Concierge booked · ${when}`,
    html: `<p>Hi ${name},</p><p>Your LUMÉA Beauty Concierge session is requested for <strong>${when}</strong> (${slot?.durationMin || 20} min) with <strong>${slot?.artist || "our atelier"}</strong>.</p><p>Topic: ${topic}</p><p>${notes ? `Notes: ${notes}` : ""}</p><p>We will email a video link shortly. Meanwhile: <a href="${base}/studio">Mirror Studio</a> · <a href="${base}/quiz">Match quiz</a></p>`,
    text: `Concierge booked for ${when}. Topic ${topic}.`,
    template: "generic",
    meta: { slotId, topic },
  });

  return NextResponse.json({
    ok: true,
    message: "Concierge request received — confirmation emailed.",
    slot: slot || null,
  });
}
