import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const project = await prisma.project.update({
      where: { id },
      data: {
        name: body.name,
        number: body.number,
        status: body.status,
        type: body.type,
        description: body.description || null,
        address: body.address || null,
        city: body.city || null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        budget: body.budget ? parseFloat(body.budget) : null,
        clientId: body.clientId,
        managerId: body.managerId || null,
      },
    });
    return NextResponse.json(project);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
