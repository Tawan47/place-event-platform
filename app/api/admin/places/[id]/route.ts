import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Next.js 15+ params is a Promise
        const { id } = await params;
        const place = await prisma.place.findUnique({
            where: { id },
            include: { images: true },
        });

        if (!place) {
            return NextResponse.json({ error: "Place not found" }, { status: 404 });
        }

        return NextResponse.json(place);
    } catch (error) {
        return NextResponse.json(
            { error: "Fetch place failed" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const category = formData.get("category") as string;
        const description = formData.get("description") as string | null;
        const station = formData.get("station") as string;
        const openTime = formData.get("openTime") as string | null;
        const travelInfo = formData.get("travelInfo") as string | null;
        const phone = formData.get("phone") as string | null;
        const mapUrl = formData.get("mapUrl") as string | null;
        const facebook = formData.get("facebook") as string | null;
        const line = formData.get("line") as string | null;
        const instagram = formData.get("instagram") as string | null;
        const website = formData.get("website") as string | null;
        const imagesField = formData.getAll("images") as File[];
        const imageField = formData.getAll("image") as File[];
        const allImages = [...imagesField, ...imageField];

        const data: any = {
            name,
            category,
            description,
            station,
            openTime,
            travelInfo,
            phone,
            mapUrl,
            facebook,
            line,
            instagram,
            website,
        };

        const imageRecords: { url: string }[] = [];

        // ✅ อัปโหลดรูปภาพไปยัง Cloudinary
        for (const image of allImages) {
            if (!image || !(image instanceof File) || image.size === 0) continue;

            try {
                const imageUrl = await uploadImageToCloudinary(image, 'places');
                if (imageUrl) {
                    imageRecords.push({ url: imageUrl });
                }
            } catch (err) {
                console.error("Error uploading image to Cloudinary:", err);
            }
        }

        const updateData: any = {
            ...data,
        };

        if (imageRecords.length > 0) {
            updateData.imageUrl = imageRecords[0].url;
            updateData.images = {
                deleteMany: {}, // ✅ ลบรูปเก่าออกก่อน
                create: imageRecords,
            };
        }

        const place = await prisma.place.update({
            where: { id },
            data: updateData,
            include: { images: true },
        });

        return NextResponse.json(place);
    } catch (error) {
        console.error("UPDATE PLACE ERROR:", error);
        return NextResponse.json(
            { error: "Update place failed" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.place.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Delete place failed" },
            { status: 500 }
        );
    }
}
