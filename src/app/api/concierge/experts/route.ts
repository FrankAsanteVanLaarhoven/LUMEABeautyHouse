import { NextRequest, NextResponse } from "next/server";
import { VERIFIED_EXPERTS } from "@/lib/concierge-experts";
import { applyAsExpert } from "@/lib/concierge-store";
import { sendEmail, appBaseUrl } from "@/lib/email";
import type { ExpertSpecialty } from "@/lib/concierge-experts";

export async function GET() {
  return NextResponse.json({
    experts: VERIFIED_EXPERTS.map((e) => ({
      ...e,
      // public shape
    })),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  if (!name || !email.includes("@")) {
    return NextResponse.json(
      { error: "Name and valid email required" },
      { status: 400 }
    );
  }

  const specialties = (Array.isArray(body.specialties)
    ? body.specialties
    : String(body.specialties || "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)) as ExpertSpecialty[];

  const brandSlugs = Array.isArray(body.brandSlugs)
    ? body.brandSlugs.map(String)
    : String(body.brandSlugs || "lumea")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

  const app = await applyAsExpert({
    name,
    email,
    title: String(body.title || "Beauty expert"),
    bio: String(body.bio || ""),
    specialties: specialties.length
      ? specialties
      : (["shade-match"] as ExpertSpecialty[]),
    brandSlugs: brandSlugs.length ? brandSlugs : ["lumea"],
    instagram: body.instagram ? String(body.instagram) : undefined,
    yearsExp: Number(body.yearsExp) || 1,
  });

  const base = appBaseUrl(req.url);
  await sendEmail({
    to: email,
    subject: "LUMÉA Concierge expert application received",
    html: `<p>Hi ${name},</p><p>We received your application to become a verified LUMÉA Beauty Concierge.</p><p>Verified experts host 1:1 and group live sessions, set fees, and earn product commissions when clients shop your recommendations.</p><p>Status: <strong>pending review</strong>.</p><p><a href="${base}/concierge">Explore concierge</a></p>`,
    text: `Application received for ${name}. Pending review.`,
    template: "generic",
    meta: { applicationId: app.id },
  });

  return NextResponse.json({
    ok: true,
    application: { id: app.id, status: app.status },
    message:
      "Application received. Once verified you can charge session fees and earn product commissions.",
  });
}
