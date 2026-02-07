"use client";

import { useState } from "react";
import BTSMap from "@/components/bts/BTSMap";
import PlaceCard from "@/components/ui/Card";
import { BTS_SUKHUMVIT } from "@/data/stations";
import type { PlaceDTO } from "@/types/place";

type Props = {
  places: PlaceDTO[];
};

export default function HomeClient({ places }: Props) {
  const [activeStation, setActiveStation] = useState<string | null>(null);

  const filteredPlaces = activeStation
    ? places.filter((p) => p.station === activeStation)
    : places;

  return (
    <main className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-64px)] px-6 py-6 bg-[#020617] text-white">
      {/* Sidebar */}
      <aside className="w-full lg:w-[320px] shrink-0 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 h-[500px] lg:h-[calc(100vh-48px)] sticky top-6 overflow-hidden flex flex-col">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
          🚆 BTS Sukhumvit
        </h3>

        <BTSMap
          stations={BTS_SUKHUMVIT}
          active={activeStation}
          onSelect={setActiveStation}
        />
      </aside>

      {/* Content */}
      <section className="flex-1 min-w-0">
        {!activeStation ? (
          // Welcome Section (Default View)
          <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-8">
            <h1 className="text-6xl md:text-8xl font-black text-[#00E07D] tracking-tighter mb-8 drop-shadow-2xl">
              skytrainspace
            </h1>
            <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-light tracking-wide mb-12">
              รวมคาเฟ่และสถานที่ยอดฮิต ติดรถไฟฟ้า BTS เดินทางง่าย ถ่ายรูปสวย
            </p>
            <p className="text-sm md:text-base text-white/30 flex items-center gap-2 font-mono uppercase tracking-widest">
              <span>�</span>
              เลือกสถานีจากแผนที่ด้านซ้ายเพื่อดูสถานที่
            </p>
          </div>
        ) : (
          // Place Grid (Filtered View)
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-green-400">📍</span>
                สถานี {activeStation}
              </h2>
              <button
                onClick={() => setActiveStation(null)}
                className="text-sm text-white/60 hover:text-white underline"
              >
                Clear Filter
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-[min-content]">
              {filteredPlaces.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-white/60">ยังไม่มีสถานที่ในสถานีนี้</p>
                </div>
              )}

              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  id={place.id}
                  title={place.name}
                  tag={place.category}
                  time={place.openTime ?? "-"}
                  station={place.station}
                  image={place.images?.[0]?.url || (place as any).imageUrl}
                  description={place.description ?? undefined}
                  mapUrl={place.mapUrl ?? undefined}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
