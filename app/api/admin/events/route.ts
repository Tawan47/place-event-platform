import { prisma } from "@/lib/prisma";
import { EventSourceType, EventStatus } from "@prisma/client";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const stationCode = formData.get("stationCode") as string;
    const placeIdManual = formData.get("placeId") as string | null;

    // ✅ รับไฟล์รูปภาพ
    const imagesField = formData.getAll("images") as File[];
    const imageField = formData.getAll("image") as File[];
    const allImages = [...imagesField, ...imageField];

    // ✅ หา place
    let placeId = placeIdManual;
    if (!placeId && stationCode) {
      const p = await prisma.place.findFirst({
        where: { station: stationCode },
      });
      placeId = p?.id || null;
    }

    if (!placeId) {
      return NextResponse.json(
        { error: "ไม่พบสถานที่ (Place) สำหรับสร้างกิจกรรมนี้" },
        { status: 400 }
      );
    }

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

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        stationCode,
        placeId,
        sourceType: EventSourceType.INTERNAL,
        sourceName: "ADMIN",
        sourceUrl: `admin:${Date.now()}`,
        status: EventStatus.PUBLISHED,
        imageUrl: imageRecords.length > 0 ? imageRecords[0].url : null,
        images: {
          create: imageRecords,
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(event);
  } catch (err) {
    console.error("CREATE EVENT ERROR:", err);
    return NextResponse.json({ error: "Create event failed" }, { status: 500 });
  }
}

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: { place: true },
  });
  return Response.json(events);
}
