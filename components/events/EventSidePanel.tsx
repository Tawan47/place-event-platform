"use client";

import { useState } from "react";
import Link from "next/link";

type EventItem = {
  id: string;
  title: string;
  description: string | null;
  stationCode: string;
  startDate: string;
  endDate: string;
  place?: {
    name: string;
    station: string;
  };
  images?: { id: string; url: string }[];
  imageUrl?: string | null;
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div
        className="bg-[#0b1220] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            📅 กิจกรรมวันที่ {date}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          {events.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-white/40 text-lg">ไม่มีกิจกรรมในวันนี้</p>
            </div>
          ) : (
            events.map((e) => (
              <div key={e.id} className="space-y-4 pb-8 border-b border-white/5 last:border-0 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-2xl font-bold text-green-400">{e.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/20">
                      🚉 {e.place?.station || e.stationCode}
                    </span>
                  </div>
                </div>

                {e.place && (
                  <div className="text-white/60 text-sm flex items-center gap-1">
                    📍 สถานที่: <span className="text-white">{e.place.name}</span>
                  </div>
                )}

                {e.description && (
                  <div className="bg-white/5 rounded-2xl p-4 text-white/80 leading-relaxed whitespace-pre-wrap">
                    {e.description}
                  </div>
                )}

                {/* Event Images */}
                {((e.images && e.images.length > 0) || e.imageUrl) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {e.images && e.images.length > 0 ? (
                      e.images.map((img) => (
                        <img
                          key={img.id}
                          src={img.url}
                          alt={e.title}
                          className="rounded-2xl w-full h-48 object-cover border border-white/10 hover:scale-[1.02] transition-transform duration-300"
                        />
                      ))
                    ) : (
                      <img
                        src={e.imageUrl!}
                        alt={e.title}
                        className="rounded-2xl w-full h-48 object-cover border border-white/10"
                      />
                    )}
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    href={`/events/${e.id}`}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all"
                  >
                    ดูรายละเอียดเพิ่มเติม ➔
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Click backdrop to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
}
