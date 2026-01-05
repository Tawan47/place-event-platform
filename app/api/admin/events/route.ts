import { prisma } from "@/lib/prisma";
import { EventSourceType, EventStatus } from "@prisma/client";


export async function POST(req: Request) {
  const body = await req.json();

  // 🔥 หา place จาก stationCode
  const place = await prisma.place.findFirst({
    where: { station: body.stationCode },
  });

  if (!place) {
    return Response.json(
      { error: "ไม่พบ Place ของ station นี้" },
      { status: 400 }
    );
  }

  const event = await prisma.event.create({
    data: {
      title: body.title,
      description: body.description,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      stationCode: body.stationCode,

      placeId: place.id, // ✅ ใช้ id จริง

      sourceType: EventSourceType.INTERNAL,
      sourceName: "ADMIN",
      sourceUrl: `admin:${Date.now()}`,
      status: EventStatus.PUBLISHED,
    },
  });

  return Response.json(event);
}

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: { place: true },
  });
  return Response.json(events);
}
