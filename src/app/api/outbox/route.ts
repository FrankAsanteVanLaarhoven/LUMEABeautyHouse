import { NextResponse } from "next/server";
import { listOutbox } from "@/lib/email";

/** Demo inbox — last emails logged (no secrets). Useful for conversion QA. */
export async function GET() {
  const emails = await listOutbox(30);
  return NextResponse.json({
    emails: emails.map((e) => ({
      id: e.id,
      to: e.to,
      subject: e.subject,
      template: e.template,
      status: e.status,
      provider: e.provider,
      createdAt: e.createdAt,
      meta: e.meta,
    })),
  });
}
