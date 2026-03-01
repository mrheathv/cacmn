import { NextResponse } from "next/server";

const DEMO = NextResponse.json(
  { error: "Demo mode — form submissions are disabled." },
  { status: 409 }
);

export async function POST() { return DEMO; }
export async function PATCH() { return DEMO; }
export async function DELETE() { return DEMO; }

