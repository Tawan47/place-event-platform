import { config } from 'dotenv';
config({ path: '.env.local' });

import { prisma } from './lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '***set***' : 'NOT SET',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***set***' : 'NOT SET',
});

async function migrateLocalImagesToCloudinary() {
    console.log('🚀 Starting migration of local images to Cloudinary...\n');

    // Get all PlaceImages with local URLs
    const placeImages = await prisma.placeImage.findMany({
        where: {
            url: {
                startsWith: '/uploads/',
            },
        },
    });

    console.log(`📦 Found ${placeImages.length} PlaceImages to migrate\n`);

    let successCount = 0;
    let failCount = 0;

    for (const img of placeImages) {
        const localPath = path.join(process.cwd(), 'public', img.url);

        if (!fs.existsSync(localPath)) {
            console.log(`❌ File not found: ${localPath}`);
            failCount++;
            continue;
        }

        try {
            const result = await cloudinary.uploader.upload(localPath, {
                folder: 'place-event-platform/places',
                resource_type: 'image',
            });

            await prisma.placeImage.update({
                where: { id: img.id },
                data: { url: result.secure_url },
            });

            console.log(`✅ Migrated: ${img.url} → ${result.secure_url}`);
            successCount++;
        } catch (error) {
            console.error(`❌ Error migrating ${img.url}:`, error);
            failCount++;
        }
    }

    // Also update Place.imageUrl if it starts with /uploads/
    const placesWithLocalImages = await prisma.place.findMany({
        where: {
            imageUrl: {
                startsWith: '/uploads/',
            },
        },
    });

    console.log(`\n📦 Found ${placesWithLocalImages.length} Places with local imageUrl\n`);

    for (const place of placesWithLocalImages) {
        if (!place.imageUrl) continue;

        const localPath = path.join(process.cwd(), 'public', place.imageUrl);

        if (!fs.existsSync(localPath)) {
            console.log(`❌ File not found: ${localPath}`);
            continue;
        }

        try {
            const result = await cloudinary.uploader.upload(localPath, {
                folder: 'place-event-platform/places',
                resource_type: 'image',
            });

            await prisma.place.update({
                where: { id: place.id },
                data: { imageUrl: result.secure_url },
            });

            console.log(`✅ Migrated Place imageUrl: ${place.imageUrl} → ${result.secure_url}`);
            successCount++;
        } catch (error) {
            console.error(`❌ Error migrating ${place.imageUrl}:`, error);
            failCount++;
        }
    }

    // Get all EventImages with local URLs
    const eventImages = await prisma.eventImage.findMany({
        where: {
            url: {
                startsWith: '/uploads/',
            },
        },
    });

    console.log(`\n📦 Found ${eventImages.length} EventImages to migrate\n`);

    for (const img of eventImages) {
        const localPath = path.join(process.cwd(), 'public', img.url);

        if (!fs.existsSync(localPath)) {
            console.log(`❌ File not found: ${localPath}`);
            failCount++;
            continue;
        }

        try {
            const result = await cloudinary.uploader.upload(localPath, {
                folder: 'place-event-platform/events',
                resource_type: 'image',
            });

            await prisma.eventImage.update({
                where: { id: img.id },
                data: { url: result.secure_url },
            });

            console.log(`✅ Migrated: ${img.url} → ${result.secure_url}`);
            successCount++;
        } catch (error) {
            console.error(`❌ Error migrating ${img.url}:`, error);
            failCount++;
        }
    }

    // Also update Event.imageUrl if it starts with /uploads/
    const eventsWithLocalImages = await prisma.event.findMany({
        where: {
            imageUrl: {
                startsWith: '/uploads/',
            },
        },
    });

    console.log(`\n📦 Found ${eventsWithLocalImages.length} Events with local imageUrl\n`);

    for (const event of eventsWithLocalImages) {
        if (!event.imageUrl) continue;

        const localPath = path.join(process.cwd(), 'public', event.imageUrl);

        if (!fs.existsSync(localPath)) {
            console.log(`❌ File not found: ${localPath}`);
            continue;
        }

        try {
            const result = await cloudinary.uploader.upload(localPath, {
                folder: 'place-event-platform/events',
                resource_type: 'image',
            });

            await prisma.event.update({
                where: { id: event.id },
                data: { imageUrl: result.secure_url },
            });

            console.log(`✅ Migrated Event imageUrl: ${event.imageUrl} → ${result.secure_url}`);
            successCount++;
        } catch (error) {
            console.error(`❌ Error migrating ${event.imageUrl}:`, error);
            failCount++;
        }
    }

    console.log(`\n✨ Migration complete!`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);

    await prisma.$disconnect();
}

migrateLocalImagesToCloudinary();
