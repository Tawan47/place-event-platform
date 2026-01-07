import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('--- Testing Multiple Image Creation ---')

    const testName = `Test-${Date.now()}`

    try {
        const place = await prisma.place.create({
            data: {
                name: testName,
                category: 'Test',
                station: 'N1',
                imageUrl: '/uploads/test-primary.jpg',
                images: {
                    create: [
                        { url: '/uploads/test-1.jpg' },
                        { url: '/uploads/test-2.jpg' }
                    ]
                }
            },
            include: {
                images: true
            }
        })

        console.log('Success!')
        console.log('Created Place:', JSON.stringify(place, null, 2))

        // Verify count in table
        const count = await prisma.placeImage.count({
            where: { placeId: place.id }
        })
        console.log(`Images found in PlaceImage table for this ID: ${count}`)

    } catch (err) {
        console.error('FAILED to create:', err)
    } finally {
        await prisma.$disconnect()
    }
}

main()
