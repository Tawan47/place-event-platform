"use client";

import Link from "next/link";

type EventItem = {
  id: string;
  title: string;
  stationCode: string;
};

export default function EventSidePanel({
  date,
  events,
  onClose,
}: {
  date: number | null;
  events: EventItem[];
  onClose: () => void;
}) {
  if (!date) return null;

  return (
    <aside className="fixed right-0 top-0 h-full w-80 bg-[#020617] border-l border-white/10 p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">📅 วันที่ {date}</h2>
        <button onClick={onClose} className="text-white/60">✕</button>
      </div>

      {events.length === 0 && (
        <p className="text-white/40 text-sm">ไม่มีอีเวนต์</p>
      )}

      <ul className="space-y-3">
        {events.map((e) => (
          <li
            key={e.id}
            className="p-3 rounded bg-white/5 hover:bg-white/10"
          >
            <Link href={`/events/${e.id}`}>
              <div className="font-medium">{e.title}</div>
              <div className="text-xs text-green-400">
                🚉 {e.stationCode}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
