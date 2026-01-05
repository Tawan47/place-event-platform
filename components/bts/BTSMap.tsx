"use client";

import { useEffect, useRef } from "react";
import StationNode from "./StationNode";
import { Station } from "@/data/stations";

type Props = {
  stations: Station[];
  active: string | null
  onSelect: (code: string) => void;
};

export default function BTSMap({ stations, active, onSelect }: Props) {
  const gap = 56;
  const containerRef = useRef<HTMLDivElement>(null);

  // 🔑 ตำแหน่งเดียวกับ DOT
  const dotOffset = 38;     // marginLeft ของ StationNode
  const dotSize = 16;       // w-4
  const lineWidth = 12;     // w-3
  const lineX = dotOffset + dotSize / 2 - lineWidth / 2;

  // 🔥 Auto scroll to active station
  useEffect(() => {
    const index = stations.findIndex((s) => s.code === active);
    if (index === -1 || !containerRef.current) return;

    containerRef.current.scrollTo({
      top: index * gap - 120,
      behavior: "smooth",
    });
  }, [active, stations]);

  return (
    <div
      ref={containerRef}
      className="relative h-full overflow-y-auto pl-16 pr-6"
    >
      {/* GREEN LINE */}
      <div
        className="absolute top-0 bg-green-500 rounded-full"
        style={{
          width: lineWidth,
          left: lineX,                     // 🎯 ตรงกับวงกลม
          height: stations.length * gap,
        }}
      />

      {/* STATIONS */}
      {stations.map((st, i) => (
        <StationNode
          key={st.code}
          code={st.code}
          name={st.name}
          top={i * gap}
          active={st.code === active}
          onClick={() => onSelect(st.code)}
        />
      ))}
    </div>
  );
}
