import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year"));
  const station = searchParams.get("station");

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  try {

    const events = await (prisma.event as any).findMany({
      where: {
        startDate: { gte: start, lte: end },
        ...(station ? { stationCode: station } : {}),
      },
      include: {
        images: true,
        place: true,
      },
    });

    return NextResponse.json(events);
  } catch (error: any) {
    console.error("FETCH EVENTS ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
