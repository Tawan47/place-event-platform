import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const places = await prisma.place.findMany({
        include: {
            images: true,
        },
    })

    console.log('Places and their images:')
    places.forEach((p) => {
        console.log(`- ${p.name} (${p.id}):`)
        console.log(`  - imageUrl column: ${p.imageUrl}`)
        console.log(`  - images relation: ${p.images.length} images`)
        p.images.forEach((img) => {
            console.log(`    - ${img.url}`)
        })
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
