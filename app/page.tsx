import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  const places = await prisma.place.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      category: true,
      station: true,
      openTime: true,
      description: true,
      travelInfo: true,
      phone: true,
      mapUrl: true,
      imageUrl: true, // ✅ ใช้แบบเดิม
      createdAt: true,
    },
  });

  return <HomeClient places={places} />;
}
