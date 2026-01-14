
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Attempting to create a place with contact fields...");
        const place = await prisma.place.create({
            data: {
                name: "Test Place " + Date.now(),
                category: "Cafe",
                station: "N8",
                facebook: "https://facebook.com/test",
                line: "@test",
                instagram: "@test_ig",
                website: "https://test.com",
            }
        });
        console.log("Successfully created place:", place);
    } catch (error) {
        console.error("Error creating place:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
