import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";

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
    const image = formData.get("image") as File | null;

    // ✅ validate ขั้นต้น
    if (!name || !category || !station) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;

    // ✅ ถ้ามีไฟล์ → save
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${image.name}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);

      imageUrl = `/uploads/${fileName}`;
    }

    // ✅ create place
    const place = await prisma.place.create({
      data: {
        name,
        category,
        description,
        station,
        imageUrl,
        openTime,
        travelInfo,
        phone,
        mapUrl,
      },
    });

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
    });
    return NextResponse.json(places);
  } catch (error) {
    return NextResponse.json(
      { error: "Fetch places failed" },
      { status: 500 }
    );
  }
}
