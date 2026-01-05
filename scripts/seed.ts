import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.place.createMany({
    data: [
      {
        name: "Central World",
        category: "Mall",
        station: "BTS Chit Lom",
        travelInfo: "ทางออก 6",
        mapUrl: "https://maps.google.com/?q=Central+World",
      },
      {
        name: "Siam Paragon",
        category: "Mall",
        station: "BTS Siam",
        travelInfo: "ทางออก 3",
        mapUrl: "https://maps.google.com/?q=Siam+Paragon",
      },
    ],
  });

  console.log("✅ Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
