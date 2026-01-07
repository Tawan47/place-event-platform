import { prisma } from "@/lib/prisma";
import { EventStatus, EventSourceType } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
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

        // ✅ บันทึกรูปภาพลงดิสก์
        for (const image of allImages) {
            if (!image || !(image instanceof File) || image.size === 0) continue;

            try {
                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const uploadDir = path.join(process.cwd(), "public/uploads");
                await fs.mkdir(uploadDir, { recursive: true });

                const fileName = `${Date.now()}-${image.name}`;
                const filePath = path.join(uploadDir, fileName);

                await fs.writeFile(filePath, buffer);

                imageRecords.push({ url: `/uploads/${fileName}` });
            } catch (err) {
                console.error("Error saving event image:", err);
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
        await prisma.event.delete({
            where: { id },
        });

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: "Delete event failed" }, { status: 500 });
    }
}
