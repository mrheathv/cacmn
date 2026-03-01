import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const wo = await prisma.workOrder.update({
      where: { id },
      data: {
        number: body.number,
        title: body.title,
        description: body.description || null,
        status: body.status,
        priority: body.priority,
        clientId: body.clientId,
        projectId: body.projectId || null,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        laborCost: parseFloat(body.laborCost || "0"),
        materialCost: parseFloat(body.materialCost || "0"),
      },
    });
    return NextResponse.json(wo);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update work order" }, { status: 500 });
  }
}
