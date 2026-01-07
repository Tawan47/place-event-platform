"use client";

import { useEffect, useState } from "react";
import AdminTabs from "@/components/admin/AdminTabs";
import Link from "next/link";

type Place = {
  id: string;
  name: string;
  category: string;
  station: string;
};

export default function Page() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPlaces() {
    try {
      const res = await fetch("/api/admin/places");
      const data = await res.json();
      setPlaces(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlaces();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบสถานที่นี้?")) return;

    try {
      const res = await fetch(`/api/admin/places/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("ลบสำเร็จ");
        fetchPlaces();
      } else {
        alert("ลบไม่สำเร็จ");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0b1220] to-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-white/60 hover:text-white transition">
            ← กลับหน้าหลัก
          </Link>
          <h1 className="text-xl font-bold text-green-400">Admin Dashboard</h1>
          <div />
        </div>

        <div className="mb-8">
          <AdminTabs active="places" />
        </div>

        <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">🏢 จัดการสถานที่</h2>
            <Link
              href="/admin"
              className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-xl font-semibold transition"
            >
              + เพิ่มสถานที่
            </Link>
          </div>

          {loading ? (
            <p className="text-center text-white/50">กำลังโหลด...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-white/60 text-sm">
                    <th className="py-4 font-medium px-4">ชื่อสถานที่</th>
                    <th className="py-4 font-medium">หมวดหมู่</th>
                    <th className="py-4 font-medium">สถานี</th>
                    <th className="py-4 font-medium text-right px-4">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {places.map((place) => (
                    <tr key={place.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-4 px-4 font-medium">{place.name}</td>
                      <td className="py-4 text-white/70">{place.category}</td>
                      <td className="py-4 text-white/70">{place.station}</td>
                      <td className="py-4 text-right px-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin?edit=${place.id}`}
                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg text-sm transition"
                          >
                            แก้ไข
                          </Link>
                          <button
                            onClick={() => handleDelete(place.id)}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg text-sm transition"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {places.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-white/40">
                        ยังไม่มีสถานที่ในระบบ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
