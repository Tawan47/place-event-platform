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
    <main className="flex gap-8 h-[calc(100vh-64px)] px-8 py-6">
      {/* Sidebar */}
      <aside className="w-[320px] shrink-0 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
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
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPlaces.length === 0 && (
          <p className="text-white/60">ยังไม่มีสถานที่ในระบบ</p>
        )}

        {filteredPlaces.map((place) => (
          <PlaceCard
            key={place.id}
            id={place.id}
            title={place.name}
            tag={place.category}
            time={place.openTime ?? "-"}
            image={place.imageUrl ?? undefined}
            description={place.description ?? undefined}
            mapUrl={place.mapUrl ?? undefined}
          />
        ))}
      </section>
    </main>
  );
}
