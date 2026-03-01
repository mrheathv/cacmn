import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const client = await prisma.client.update({
      where: { id },
      data: {
        name: body.name,
        type: body.type,
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
    return NextResponse.json(client);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}
