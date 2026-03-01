import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        number: body.number,
        status: body.status,
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
    return NextResponse.json(invoice);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}
