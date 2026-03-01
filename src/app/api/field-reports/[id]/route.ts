import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const report = await prisma.fieldReport.update({
      where: { id },
      data: {
        projectId: body.projectId,
        authorId: body.authorId,
        date: body.date ? new Date(body.date) : new Date(),
        weather: body.weather || null,
        crewCount: parseInt(body.crewCount || "0"),
        hoursWorked: parseFloat(body.hoursWorked || "0"),
        workPerformed: body.workPerformed || null,
        issues: body.issues || null,
        safetyNotes: body.safetyNotes || null,
      },
    });
    return NextResponse.json(report);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update field report" }, { status: 500 });
  }
}
