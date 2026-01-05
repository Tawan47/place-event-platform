import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PlaceDetailPage({ params }: Props) {
  // ✅ unwrap params (สำคัญมากใน Next 15+)
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const place = await prisma.place.findUnique({
    where: { id },
  });

  if (!place) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 text-white">
      {/* Title */}
      <h1 className="text-3xl font-bold">{place.name}</h1>
      <p className="text-white/60 mt-1">{place.category}</p>

      {/* Image */}
      {place.imageUrl && (
        <img
        src={place.imageUrl}
        alt={place.name}
        className="rounded-2xl mt-6 w-full object-cover max-h-[420px]"
        />
        )}

      {/* Description */}
      {place.description && (
        <p className="mt-6 text-white/80 leading-relaxed">
          {place.description}
        </p>
      )}

      {/* ✅ ข้อมูลสำคัญ */}
      <div className="mt-8 space-y-3 text-sm text-white/75">
        <p>🚆 <span className="font-medium">สถานี:</span> {place.station}</p>

        {place.openTime && (
          <p>⏰ <span className="font-medium">เวลาเปิด:</span> {place.openTime}</p>
        )}

        {place.phone && (
          <p>📞 <span className="font-medium">โทร:</span> {place.phone}</p>
        )}

        {place.travelInfo && (
          <p>🗺️ <span className="font-medium">การเดินทาง:</span> {place.travelInfo}</p>
        )}

        {place.mapUrl && (
          <a
            href={place.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-green-400 hover:underline mt-2"
          >
            📍 เปิดใน Google Maps
          </a>
        )}
      </div>
    </div>
  );
}
