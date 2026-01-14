import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
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

    // ✅ รับไฟล์ (รองรับทั้งชื่อ images และ image)
    const imagesField = formData.getAll("images") as File[];
    const imageField = formData.getAll("image") as File[];
    const allImages = [...imagesField, ...imageField];

    // ✅ validate
    if (!name || !category || !station) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const imageRecords: { url: string }[] = [];

    // ✅ save images
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

        imageRecords.push({
          url: `/uploads/${fileName}`,
        });
      } catch (err) {
        console.error("Error saving image:", err);
      }
    }

    // ✅ create place + images (Hybrid approach)
    const place = await prisma.place.create({
      data: {
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
        imageUrl: imageRecords.length > 0 ? imageRecords[0].url : null,
        images: {
          create: imageRecords,
        },
      },
      include: {
        images: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/places");

    return NextResponse.json(place, { status: 201 });
  } catch (error) {
    console.error("CREATE PLACE ERROR:", error);
    return NextResponse.json(
      { error: "Create place failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const places = await prisma.place.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
      },
    });

    return NextResponse.json(places);
  } catch (error) {
    return NextResponse.json(
      { error: "Fetch places failed" },
      { status: 500 }
    );
  }
}
