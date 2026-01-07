import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const images = await prisma.placeImage.findMany()
    console.log('All PlaceImage records:', JSON.stringify(images, null, 2))
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
