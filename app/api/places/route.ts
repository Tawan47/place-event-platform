import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const station = searchParams.get("station");

  if (!station) {
    return Response.json([], { status: 200 });
  }

  const places = await prisma.place.findMany({
    where: {
      station: station,
    },
    orderBy: { name: "asc" },
  });

  return Response.json(places);
}
