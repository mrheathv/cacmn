import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Delete and recreate line items
    await prisma.estimateItem.deleteMany({ where: { estimateId: id } });

    const estimate = await prisma.estimate.update({
      where: { id },
      data: {
        number: body.number,
        title: body.title,
        status: body.status,
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
    return NextResponse.json(estimate);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update estimate" }, { status: 500 });
  }
}
