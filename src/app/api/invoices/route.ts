import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const invoice = await prisma.invoice.create({
      data: {
        number: body.number,
        status: body.status || "DRAFT",
        clientId: body.clientId,
        projectId: body.projectId || null,
        issueDate: body.issueDate ? new Date(body.issueDate) : new Date(),
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        subtotal: body.subtotal,
        taxRate: body.taxRate,
        taxAmount: body.taxAmount,
        total: body.total,
        amountPaid: body.amountPaid || 0,
        notes: body.notes || null,
        lineItems: {
          create: (body.items ?? []).map((item: { description: string; quantity: number; unitPrice: number; total: number }, index: number) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
            order: index,
          })),
        },
      },
    });
    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
