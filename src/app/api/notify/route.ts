import { NextRequest, NextResponse } from "next/server";
import { addLead, listLeads } from "@/lib/notify-store";
import { createAbandon } from "@/lib/abandon";
import { appBaseUrl, sendEmail, templates } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const kind = String(body.type || "restock");
  const base = appBaseUrl(req.url);
  const t = templates();

  if (kind === "restock") {
    const lead = await addLead({
      type: "restock",
      email,
      productSlug: String(body.productSlug || ""),
      productName: String(body.productName || "Product"),
      variantId: body.variantId ? String(body.variantId) : undefined,
    });
    const productUrl = `${base}/product/${body.productSlug || ""}`;
    // Demo: send "you're on the list" now; real restock would fire when stock returns
    const msg = t.restock({
      productName: String(body.productName || "Product"),
      productUrl,
    });
    const mail = await sendEmail({
      to: email,
      subject: `We'll alert you · ${body.productName || "product"}`,
      html: msg.html.replace("It's back", "You're on the list"),
      text: `Restock alert set for ${body.productName}. We'll email ${email} when it's back.`,
      template: "restock",
      meta: { leadId: lead.id, productSlug: body.productSlug },
    });
    return NextResponse.json({
      ok: true,
      message: "Restock alert saved — confirmation emailed.",
      lead,
      emailId: mail.id,
      emailStatus: mail.status,
    });
  }

  if (kind === "abandon") {
    const items = Array.isArray(body.items) ? body.items : [];
    const cartValue = Number(body.cartValue) || 0;
    const rec = await createAbandon({
      email,
      items,
      cartValue,
    });
    const lead = await addLead({
      type: "abandon",
      email,
      cartValue,
      itemCount: items.length || Number(body.itemCount) || 0,
    });
    const recoverUrl = `${base}/recover?token=${rec.token}`;
    const msg = t.abandon({
      recoverUrl,
      itemCount: items.length || Number(body.itemCount) || 1,
      cartValue,
      code: "WELCOME10",
    });
    const mail = await sendEmail({
      to: email,
      ...msg,
      template: "abandon",
      meta: { token: rec.token, leadId: lead.id },
    });
    return NextResponse.json({
      ok: true,
      message: "Cart saved — recovery email sent with WELCOME10.",
      token: rec.token,
      recoverUrl,
      lead,
      emailId: mail.id,
      emailStatus: mail.status,
    });
  }

  if (kind === "newsletter" || kind === "subscribe") {
    const lead = await addLead({
      type: kind === "subscribe" ? "subscribe" : "newsletter",
      email,
      productSlug: body.productSlug ? String(body.productSlug) : undefined,
      intervalDays: body.intervalDays ? Number(body.intervalDays) : 30,
    });
    const msg =
      kind === "subscribe"
        ? t.subscribe({
            productName: String(body.productSlug || "your ritual"),
            intervalDays: Number(body.intervalDays) || 30,
          })
        : t.newsletter();
    const mail = await sendEmail({
      to: email,
      ...msg,
      template: kind === "subscribe" ? "subscribe" : "newsletter",
      meta: { leadId: lead.id },
    });
    return NextResponse.json({
      ok: true,
      message:
        kind === "subscribe"
          ? "Subscription preference saved — confirmation emailed."
          : "You're on the list — welcome email sent.",
      lead,
      emailId: mail.id,
      emailStatus: mail.status,
    });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}

export async function GET() {
  const leads = await listLeads();
  return NextResponse.json({
    count: leads.length,
    summary: {
      restock: leads.filter((l) => l.type === "restock").length,
      abandon: leads.filter((l) => l.type === "abandon").length,
      subscribe: leads.filter(
        (l) => l.type === "subscribe" || l.type === "newsletter"
      ).length,
    },
  });
}
