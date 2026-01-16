import { prisma } from "@/lib/prisma";
import ImageSlider from "@/components/ui/ImageSlider";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

import { MapPin, Clock, Phone, Train, Info, Navigation, Star, Facebook, Instagram, Globe, MessageCircle, ArrowLeft } from "lucide-react";
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

        {/* Header & Back Button */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-green-400 transition mb-6 group"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-green-400/10 transition">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">กลับหน้าหลัก</span>
          </a>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-4 py-1.5 bg-green-500/10 text-green-400 rounded-full text-sm font-semibold border border-green-500/20 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
                  {place.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 drop-shadow-sm">
                {place.name}
              </h1>
            </div>
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
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white relative z-10">
                  <div className="p-2 rounded-xl bg-green-500/20 text-green-400">
                    <Info className="w-6 h-6" />
                  </div>
                  เกี่ยวกับสถานที่
                </h2>
                <p className="text-white/80 leading-relaxed text-lg whitespace-pre-wrap relative z-10 font-light">
                  {place.description}
                </p>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
              <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400">
                  <Star className="w-6 h-6" />
                </div>
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
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl sticky top-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full pointer-events-none" />

              <h3 className="text-xl font-bold mb-8 text-white flex items-center gap-2">
                <span className="w-1 h-8 bg-green-500 rounded-full inline-block" />
                ข้อมูลการติดต่อ
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-green-400 group-hover:scale-110 group-hover:bg-green-500/20 transition duration-300">
                    <Train className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-1">สถานี</p>
                    <p className="text-white font-semibold text-lg">{place.station}</p>
                  </div>
                </div>

                {place.openTime && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition duration-300">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-1">เวลาเปิด-ปิด</p>
                      <p className="text-white font-medium">{place.openTime}</p>
                    </div>
                  </div>
                )}

                {place.phone && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-yellow-400 group-hover:scale-110 group-hover:bg-yellow-500/20 transition duration-300">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-1">เบอร์โทรศัพท์</p>
                      <p className="text-white font-medium">{place.phone}</p>
                    </div>
                  </div>
                )}

                {place.travelInfo && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition duration-300">
                      <Navigation className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-1">การเดินทาง</p>
                      <p className="text-white/80 text-sm leading-relaxed">{place.travelInfo}</p>
                    </div>
                  </div>
                )}
              </div>

              {(place.facebook || place.line || place.instagram || place.website) && (
                <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                  <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">ช่องทางติดต่อ</h4>
                  {place.facebook && (
                    <a
                      href={place.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] transition group"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#1877F2]/20 flex items-center justify-center group-hover:scale-110 transition">
                        <Facebook className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Facebook</span>
                    </a>
                  )}

                  {place.line && (
                    <a
                      href={place.line.startsWith("http") ? place.line : `https://line.me/R/ti/p/${place.line}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#06C755]/10 hover:bg-[#06C755]/20 text-[#06C755] transition group"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#06C755]/20 flex items-center justify-center group-hover:scale-110 transition">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Line</span>
                    </a>
                  )}

                  {place.instagram && (
                    <a
                      href={place.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#E4405F]/10 hover:bg-[#E4405F]/20 text-[#E4405F] transition group"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#E4405F]/20 flex items-center justify-center group-hover:scale-110 transition">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Instagram</span>
                    </a>
                  )}

                  {place.website && (
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition group"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Website</span>
                    </a>
                  )}
                </div>
              )}

              {place.mapUrl && (
                <a
                  href={place.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black font-bold py-4 rounded-xl transition-all shadow-[0_10px_30px_-10px_rgba(34,197,94,0.4)] hover:shadow-[0_10px_40px_-10px_rgba(34,197,94,0.6)] transform hover:-translate-y-1"
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
