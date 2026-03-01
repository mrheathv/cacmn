import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const estimate = await prisma.estimate.create({
      data: {
        number: body.number,
        title: body.title,
        status: body.status || "DRAFT",
        clientId: body.clientId,
        projectId: body.projectId || null,
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        notes: body.notes || null,
        subtotal: body.subtotal,
        taxRate: body.taxRate,
        total: body.total,
        lineItems: {
          create: (body.items ?? []).map((item: { description: string; category: string; quantity: number; unit: string; unitPrice: number; total: number }, index: number) => ({
            description: item.description,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            total: item.total,
            order: index,
          })),
        },
      },
    });
    return NextResponse.json(estimate, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create estimate" }, { status: 500 });
  }
}
