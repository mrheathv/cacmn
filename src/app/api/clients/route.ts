import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await prisma.client.create({
      data: {
        name: body.name,
        type: body.type || "COMMERCIAL",
        contactName: body.contactName || null,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        city: body.city || null,
        state: body.state || "MN",
        zip: body.zip || null,
        notes: body.notes || null,
        active: body.active !== false,
      },
    });
    return NextResponse.json(client, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
