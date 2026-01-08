import { prisma } from "@/lib/prisma";
import ImageSlider from "@/components/ui/ImageSlider";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

import { MapPin, Clock, Phone, Train, Info, Navigation, Star } from "lucide-react";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";

export default async function PlaceDetailPage({ params }: Props) {
  // ✅ unwrap params (สำคัญมากใน Next 15+)
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const place = await prisma.place.findUnique({
    where: { id },
    include: {
      images: true,
      reviews: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!place) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#020617] text-white">
      <div className="max-w-6xl mx-auto py-12 px-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-2">
            {place.name}
          </h1>
          <div className="flex items-center gap-2 text-white/60 text-lg">
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium border border-white/10">
              {place.category}
            </span>
          </div>
        </div>

        {/* Image Slider */}
        <div className="mb-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/50">
          {place.images.length > 0 ? (
            <ImageSlider images={place.images} alt={place.name} />
          ) : place.imageUrl ? (
            <img
              src={place.imageUrl}
              alt={place.name}
              className="object-cover h-[500px] w-full"
            />
          ) : (
            <div className="h-[300px] w-full flex items-center justify-center text-white/20 text-xl font-medium">
              No Image Available
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content (Description & Reviews) */}
          <div className="lg:col-span-2 space-y-8">
            {place.description && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                  <Info className="w-6 h-6 text-green-400" />
                  เกี่ยวกับสถานที่
                </h2>
                <p className="text-white/80 leading-relaxed text-lg whitespace-pre-wrap">
                  {place.description}
                </p>
              </div>
            )}

            {/* Reviews Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                รีวิวจากผู้ใช้
              </h2>
              <div className="grid gap-8">
                <ReviewForm placeId={place.id} />
                <ReviewList reviews={place.reviews} />
              </div>
            </div>
          </div>

          {/* Sidebar (Info Card) */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg sticky top-8">
              <h3 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">
                ข้อมูลการติดต่อ
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-400">
                    <Train className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase font-semibold tracking-wider">สถานี</p>
                    <p className="text-white font-medium text-lg">{place.station}</p>
                  </div>
                </div>

                {place.openTime && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase font-semibold tracking-wider">เวลาเปิด-ปิด</p>
                      <p className="text-white font-medium">{place.openTime}</p>
                    </div>
                  </div>
                )}

                {place.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 text-yellow-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase font-semibold tracking-wider">เบอร์โทรศัพท์</p>
                      <p className="text-white font-medium">{place.phone}</p>
                    </div>
                  </div>
                )}

                {place.travelInfo && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase font-semibold tracking-wider">การเดินทาง</p>
                      <p className="text-white/80 text-sm leading-relaxed">{place.travelInfo}</p>
                    </div>
                  </div>
                )}
              </div>

              {place.mapUrl && (
                <a
                  href={place.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/20"
                >
                  <MapPin className="w-5 h-5" />
                  เปิดใน Google Maps
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
