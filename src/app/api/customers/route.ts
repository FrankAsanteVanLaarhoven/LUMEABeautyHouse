import { NextRequest, NextResponse } from "next/server";
import { listCustomers, upsertCustomer } from "@/lib/db";

export async function GET() {
  const customers = await listCustomers();
  return NextResponse.json({ customers });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customer = await upsertCustomer(body);
    return NextResponse.json({ customer }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 400 }
    );
  }
}
