import { prisma } from "@/lib/prisma";
import { EventStatus, EventSourceType } from "@prisma/client";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            images: true,
            place: true,
        }
    });

    if (!event) {
        return Response.json({ error: "Event not found" }, { status: 404 });
    }

    return Response.json(event);
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const formData = await req.formData();

        const title = formData.get("title") as string;
        const description = formData.get("description") as string | null;
        const startDate = formData.get("startDate") as string;
        const endDate = formData.get("endDate") as string;
        const stationCode = formData.get("stationCode") as string;
        const placeId = formData.get("placeId") as string;
        const status = formData.get("status") as string;

        // ✅ รับไฟล์รูปภาพ
        const imagesField = formData.getAll("images") as File[];
        const imageField = formData.getAll("image") as File[];
        const allImages = [...imagesField, ...imageField];

        const imageRecords: { url: string }[] = [];

        // ✅ อัปโหลดรูปภาพไปยัง Cloudinary
        for (const image of allImages) {
            if (!image || !(image instanceof File) || image.size === 0) continue;

            try {
                const imageUrl = await uploadImageToCloudinary(image, 'events');
                if (imageUrl) {
                    imageRecords.push({ url: imageUrl });
                }
            } catch (err) {
                console.error("Error uploading event image to Cloudinary:", err);
            }
        }

        // ✅ อัปเดต event
        const updateData: any = {
            title,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            stationCode,
            placeId,
            status: (status || "PUBLISHED").toUpperCase() as EventStatus,
        };

        // Validate dates
        if (isNaN(updateData.startDate.getTime()) || isNaN(updateData.endDate.getTime())) {
            return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }

        // ถ้ามีการอัปโหลดรูปใหม่ ให้ลบรูปเดิมและใส่รูปใหม่
        if (imageRecords.length > 0) {
            // ดึงข้อมูลรูปภาพเก่ามาลบออกจาก Cloudinary
            const oldEvent = await prisma.event.findUnique({
                where: { id },
                include: { images: true }
            });

            if (oldEvent) {
                // ลบรูปใน Gallery
                for (const img of oldEvent.images) {
                    if (img.url) await deleteImageFromCloudinary(img.url);
                }
                // ลบรูปปก (ถ้าไม่อยู่ใน Gallery)
                if (oldEvent.imageUrl) {
                    const isCoverInGallery = oldEvent.images.some(img => img.url === oldEvent.imageUrl);
                    if (!isCoverInGallery) {
                        await deleteImageFromCloudinary(oldEvent.imageUrl);
                    }
                }
            }

            updateData.imageUrl = imageRecords[0].url;
            updateData.images = {
                deleteMany: {},
                create: imageRecords,
            };
        }

        const event = await (prisma.event as any).update({
            where: { id },
            data: updateData,
            include: {
                images: true,
                place: true,
            },
        });

        return NextResponse.json(event);
    } catch (error: any) {
        console.error("UPDATE EVENT ERROR:", error);
        return NextResponse.json({
            error: error.message || "Update event failed"
        }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // ดึงข้อมูลรูปภาพเก่ามาลบออกจาก Cloudinary ก่อนลบข้อมูลใน DB
        const event = await prisma.event.findUnique({
            where: { id },
            include: { images: true }
        });

        if (event) {
            for (const img of event.images) {
                if (img.url) await deleteImageFromCloudinary(img.url);
            }
            if (event.imageUrl) {
                const isCoverInGallery = event.images.some(img => img.url === event.imageUrl);
                if (!isCoverInGallery) {
                    await deleteImageFromCloudinary(event.imageUrl);
                }
            }
        }

        await prisma.event.delete({
            where: { id },
        });

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: "Delete event failed" }, { status: 500 });
    }
}
