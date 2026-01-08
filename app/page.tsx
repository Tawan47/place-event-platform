import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  const places = await prisma.place.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        take: 1,
      },
    },
  });

  return <HomeClient places={places} />;
}
