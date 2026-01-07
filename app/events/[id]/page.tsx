import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Props = {
  params: {
    id: string;
  };
};

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  if (!id) return null;

  const event = await (prisma.event as any).findUnique({
    where: { id },
    include: {
      images: true,
      place: true,
    },
  });

  if (!event) {
    return <div className="p-8 text-white">ไม่พบกิจกรรม</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-white bg-[#020617] min-h-screen">
      <h1 className="text-4xl font-extrabold text-green-400 mb-4">{event.title}</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold border border-green-500/20">
          🚉 {event.place?.station || event.stationCode}
        </span>
        <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-bold border border-blue-500/20">
          📅 {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
        </span>
      </div>

      <div className="bg-white/5 rounded-3xl p-8 mb-10 border border-white/10 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">📜 รายละเอียดกิจกรรม</h2>
        <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-lg">{event.description || "ไม่มีรายละเอียด"}</p>
      </div>

      {event.place && (
        <div className="bg-white/5 rounded-3xl p-8 mb-10 border border-white/10">
          <h2 className="text-xl font-semibold mb-2">📍 สถานที่จัดงาน</h2>
          <p className="text-white text-lg font-medium">{event.place.name}</p>
          <div className="mt-4">
            <Link href={`/places/${event.place.id}`} className="text-green-400 hover:underline">
              ดูรายละเอียดสถานที่ ➔
            </Link>
          </div>
        </div>
      )}

      {/* Gallery */}
      {(event.images.length > 0 || event.imageUrl) && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">🖼️ รูปภาพกิจกรรม</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {event.images.length > 0 ? (
              (event.images as any[]).map((img: any) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={event.title}
                  className="rounded-3xl w-full h-80 object-cover border border-white/10 hover:scale-[1.01] transition-all"
                />
              ))
            ) : (
              <img
                src={event.imageUrl!}
                alt={event.title}
                className="rounded-3xl w-full h-80 object-cover border border-white/10"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
