import { prisma } from './lib/prisma';

async function checkImages() {
    const placeImages = await prisma.placeImage.findMany({ take: 10 });
    console.log('PlaceImages:', placeImages);

    const eventImages = await prisma.eventImage.findMany({ take: 10 });
    console.log('EventImages:', eventImages);

    await prisma.$disconnect();
}

checkImages();
