import { NextRequest, NextResponse } from "next/server";
import {
  inviteTeamMember,
  listTeam,
  removeTeamMember,
  updateTeamMember,
} from "@/lib/brands";
import { requireBrand } from "@/lib/brand-auth";
import type { TeamRole } from "@/lib/types";

function authError(e: unknown) {
  const msg = e instanceof Error ? e.message : "Failed";
  if (msg === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (msg === "FORBIDDEN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ error: msg }, { status: 400 });
}

export async function GET() {
  try {
    const ctx = await requireBrand({ permission: "team:read" });
    const team = await listTeam(ctx.brand.id);
    return NextResponse.json({
      ...team,
      me: ctx.member,
      role: ctx.role,
    });
  } catch (e) {
    return authError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ctx = await requireBrand({ permission: "team:write" });
    const body = await req.json();
    if (!body.email || !body.name || !body.role) {
      return NextResponse.json(
        { error: "email, name, role required" },
        { status: 400 }
      );
    }
    const result = await inviteTeamMember(ctx.brand.id, {
      email: body.email,
      name: body.name,
      role: body.role as TeamRole,
      password: body.password,
      invitedBy: ctx.member?.id,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    return authError(e);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const ctx = await requireBrand({ permission: "team:write" });
    const body = await req.json();
    if (!body.memberId) {
      return NextResponse.json({ error: "memberId required" }, { status: 400 });
    }
    const member = await updateTeamMember(ctx.brand.id, body.memberId, {
      name: body.name,
      role: body.role,
      status: body.status,
      password: body.password,
    });
    return NextResponse.json({ member });
  } catch (e) {
    return authError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const ctx = await requireBrand({ permission: "team:write" });
    const id = new URL(req.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    await removeTeamMember(ctx.brand.id, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return authError(e);
  }
}
