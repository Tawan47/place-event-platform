import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Next.js 15+ params is a Promise
        const { id } = await params;
        const place = await prisma.place.findUnique({
            where: { id },
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
        const image = formData.get("image") as File | null;

        const data: any = {
            name,
            category,
            description,
            station,
            openTime,
            travelInfo,
            phone,
            mapUrl,
        };

        if (image && image.size > 0) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), "public/uploads");
            await fs.mkdir(uploadDir, { recursive: true });

            const fileName = `${Date.now()}-${image.name}`;
            const filePath = path.join(uploadDir, fileName);

            await fs.writeFile(filePath, buffer);

            data.imageUrl = `/uploads/${fileName}`;
        }

        const place = await prisma.place.update({
            where: { id },
            data,
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
