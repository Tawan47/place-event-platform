"use client";
import { useState } from "react";

const inputClass =
  "w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white " +
  "placeholder-white/50 focus:outline-none focus:ring-2 " +
  "focus:ring-green-400/60 focus:border-green-400 transition";

export default function AdminEventsPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    stationCode: "",
    placeId: "",
  });

  const onChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [key]: e.target.value });
    };

  async function submit() {
    if (!form.title || !form.startDate || !form.endDate || !form.placeId) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("เกิดข้อผิดพลาด");
      return;
    }

    alert("เพิ่ม Event สำเร็จ");
    setForm({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      stationCode: "",
      placeId: "",
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0b1220] to-[#020617] text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-green-400">
            📅 เพิ่มกิจกรรมใหม่
          </h1>
          <p className="text-white/60 mt-2">
            จัดการข้อมูลกิจกรรม (Event) ในระบบ
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8">

          {/* Section: Basic Info */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white/80 mb-4">
              📝 ข้อมูลกิจกรรม
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  ชื่อกิจกรรม
                </label>
                <input
                  className={inputClass}
                  placeholder="เช่น Music Festival"
                  value={form.title}
                  onChange={onChange("title")}
                />
              </div>

              {/* Station */}
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Station Code
                </label>
                <input
                  className={inputClass}
                  placeholder="เช่น E4"
                  value={form.stationCode}
                  onChange={onChange("stationCode")}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm text-white/70 mb-1">
                  รายละเอียดกิจกรรม
                </label>
                <textarea
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="รายละเอียดกิจกรรม / กำหนดการ / ไฮไลต์"
                  value={form.description}
                  onChange={onChange("description")}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 mb-8" />

          {/* Section: Date & Place */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white/80 mb-4">
              🗓 เวลา & สถานที่
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  วันที่เริ่ม
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.startDate}
                  onChange={onChange("startDate")}
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  วันที่สิ้นสุด
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.endDate}
                  onChange={onChange("endDate")}
                />
              </div>

              {/* Place */}
              <div className="md:col-span-2">
                <label className="block text-sm text-white/70 mb-1">
                  Place ID
                </label>
                <input
                  className={inputClass}
                  placeholder="place_id จากตาราง Place"
                  value={form.placeId}
                  onChange={onChange("placeId")}
                />
                <p className="text-xs text-white/40 mt-1">
                  ใช้ ID ของสถานที่ที่ผูกกับ Event นี้
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={submit}
            className="
              w-full mt-6 rounded-2xl
              bg-gradient-to-r from-green-400 to-emerald-500
              hover:from-green-300 hover:to-emerald-400
              text-black font-bold py-4 text-lg
              transition-all duration-200
              shadow-lg shadow-green-500/20
            "
          >
            🚀 บันทึกกิจกรรม
          </button>
        </div>
      </div>
    </div>
  );
}
