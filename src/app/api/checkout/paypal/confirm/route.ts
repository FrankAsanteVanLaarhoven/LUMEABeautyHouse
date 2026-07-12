import { NextRequest, NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/db";
import { sendEmail, templates } from "@/lib/email";

/** Called from success page after PayPal return — marks order paid (demo IPN) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderNumber = String(body.orderNumber || body.order || "");
    if (!orderNumber) {
      return NextResponse.json({ error: "Order required" }, { status: 400 });
    }

    const order = await getOrder(orderNumber);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "pending") {
      const updated = await updateOrder(order.id, {
        status: "paid",
        notes: `${order.notes || ""} · PayPal return confirmed`.trim(),
      });

      try {
        const msg = templates().order({
          orderNumber: updated.orderNumber,
          total: updated.total,
          email: updated.email,
        });
        await sendEmail({
          to: updated.email,
          ...msg,
          template: "order",
          meta: { orderId: updated.id, payment: "paypal" },
        });
      } catch {
        /* non-blocking */
      }

      return NextResponse.json({ ok: true, order: updated });
    }

    return NextResponse.json({ ok: true, order });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Confirm failed" },
      { status: 500 }
    );
  }
}
