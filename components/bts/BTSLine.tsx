"use client";

import { Station } from "@/data/stations";

type Props = {
  stations: Station[];
  active: string;
  onSelect: (code: string) => void;
};

export default function BTSLine({ stations, active, onSelect }: Props) {
  return (
    <aside
      className="
        ml-8
        sticky top-24
        w-[260px]
        rounded-2xl
        bg-white/10 backdrop-blur-xl
        border border-white/20
        shadow-xl
        p-4
      "
    >
      {/* Header */}
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
        🚆 BTS Sukhumvit
      </h3>

      {/* Desktop / Tablet */}
      <div className="hidden md:flex flex-col gap-1">
        {stations.map((st) => {
          const isActive = st.code === active;

          return (
            <button
              key={st.code}
              onClick={() => onSelect(st.code)}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-xl
                text-left transition-all duration-200
                ${
                  isActive
                    ? "bg-green-400 text-black font-semibold scale-[1.02] shadow-md"
                    : "text-white/80 hover:bg-white/10"
                }
              `}
            >
              <span
                className={`
                  text-xs px-2 py-1 rounded-md font-mono
                  ${
                    isActive
                      ? "bg-black/20"
                      : "bg-black/30"
                  }
                `}
              >
                {st.code}
              </span>
              <span className="text-sm">{st.name}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile (Horizontal Scroll) */}
      <div className="md:hidden flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {stations.map((st) => {
          const isActive = st.code === active;

          return (
            <button
              key={st.code}
              onClick={() => onSelect(st.code)}
              className={`
                shrink-0 flex items-center gap-2 px-4 py-2 rounded-full
                transition-all duration-200
                ${
                  isActive
                    ? "bg-green-400 text-black font-semibold shadow"
                    : "bg-white/10 text-white/80"
                }
              `}
            >
              <span className="text-xs font-mono">{st.code}</span>
              <span className="text-sm">{st.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
