import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const wo = await prisma.workOrder.create({
      data: {
        number: body.number,
        title: body.title,
        description: body.description || null,
        status: body.status || "OPEN",
        priority: body.priority || "NORMAL",
        clientId: body.clientId,
        projectId: body.projectId || null,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        laborCost: parseFloat(body.laborCost || "0"),
        materialCost: parseFloat(body.materialCost || "0"),
      },
    });
    return NextResponse.json(wo, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create work order" }, { status: 500 });
  }
}
