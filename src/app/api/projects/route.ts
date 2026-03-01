import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const project = await prisma.project.create({
      data: {
        name: body.name,
        number: body.number,
        status: body.status || "BIDDING",
        type: body.type || "COMMERCIAL",
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
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
