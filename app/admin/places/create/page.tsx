"use client";

import { useState } from "react";
import AdminTabs from "@/components/admin/AdminTabs";

const inputClass =
  "w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white " +
  "placeholder-white/50 focus:outline-none focus:ring-2 " +
  "focus:ring-green-400/60 focus:border-green-400 transition";

export default function AdminPlacesPage() {
  const [form, setForm] = useState({
    name: "",
    category: "Cafe",
    description: "",
    station: "",
    openTime: "",
    travelInfo: "",
    phone: "",
    mapUrl: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!form.name || !form.station) {
      alert("กรุณากรอกชื่อสถานที่ และเลือกสถานี");
      return;
    }

    try {
      setLoading(true);

      // ✅ ใช้ FormData
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("station", form.station);
      formData.append("openTime", form.openTime);
      formData.append("travelInfo", form.travelInfo);
      formData.append("phone", form.phone);
      formData.append("mapUrl", form.mapUrl);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/admin/places", {
        method: "POST",
        body: formData, // ❌ ไม่ใส่ headers
      });

      if (!res.ok) {
        throw new Error("Create place failed");
      }

      alert("บันทึกข้อมูลสำเร็จ ✅");

      // reset
      setForm({
        name: "",
        category: "Cafe",
        description: "",
        station: "",
        openTime: "",
        travelInfo: "",
        phone: "",
        mapUrl: "",
      });
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการบันทึก ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0b1220] to-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button className="text-white/60 hover:text-white transition">
            ← กลับหน้าหลัก
          </button>
          <h1 className="text-xl font-bold text-green-400">
            Admin Dashboard
          </h1>
          <div />
        </div>

        <div className="mb-8">
          <AdminTabs active="places" />
        </div>

        <div className="max-w-5xl mx-auto rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8">

          <div className="mb-8">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              🏢 เพิ่มสถานที่ใหม่
            </h2>
            <p className="text-white/60 text-sm mt-1">
              กรอกข้อมูลสถานที่เพื่อใช้ในระบบ Event & Place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm text-white/70 mb-1">
                ชื่อสถานที่
              </label>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">
                หมวดหมู่
              </label>
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="Cafe">☕ Cafe</option>
                <option value="Park">🌳 Park</option>
                <option value="Museum">🏛 Museum</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-white/70 mb-1">
                รายละเอียดสถานที่
              </label>
              <textarea
                className={`${inputClass} h-32`}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">
                สถานีรถไฟฟ้า
              </label>
              <select
                className={inputClass}
                value={form.station}
                onChange={(e) =>
                  setForm({ ...form, station: e.target.value })
                }
              >
                <option value="">เลือกสถานี</option>
                <option value="N24">N24 - คูคต</option>
                <option value="N23">N23 - แยก คปอ.</option>
                <option value="N22">N22 - พิพิธภัณฑ์กองทัพอากาศ</option>
                <option value="N21">N21 - โรงพยาบาลภูมิพลอดุลยเดช</option>
                <option value="N20">N20 - สะพานใหม่</option>
                <option value="N19">N19 - สายหยุด</option>
                <option value="N18">N18 - พหลโยธิน 59</option>
                <option value="N17">N17 - วัดพระศรีมหาธาตุ</option>
                <option value="N16">N16 - กรมทหารราบที่ 11</option>
                <option value="N15">N15 - บางบัว</option>
                <option value="N14">N14 - กรมป่าไม้</option>
                <option value="N13">N13 - หมาวิทยาลัยเกษตรศาสตร์</option>
                <option value="N12">N12 - เสนานิคม</option>
                <option value="N11">N11 - รัชโยธิน</option>
                <option value="N20">N10 - พหลโยธิน 24</option>
                <option value="N9">N9 - ห้าแยกลาดพร้าว</option>
                <option value="N8">N8 - หมอชิต</option>
                <option value="N7">N7 - สะพานควาย</option>
                <option value="N6">N6 - เสนาร่วม</option>
                <option value="N5">N5 - อารีย์</option>
                <option value="N4">N4 - สนามเป้า</option>
                <option value="N3">N3 - อนุสาวรีย์ชัยสมรภูมิ</option>
                <option value="N2">N2 - พญาไท</option>
              </select>
            </div>

            {/* ✅ Upload File */}
            <div>
              <label className="block text-sm text-white/70 mb-1">
                รูปภาพ
              </label>
              <input
                type="file"
                accept="image/*"
                className={inputClass}
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] ?? null)
                }
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">
                เวลาเปิด–ปิด
              </label>
              <input
                className={inputClass}
                value={form.openTime}
                onChange={(e) =>
                  setForm({ ...form, openTime: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">
                การเดินทาง
              </label>
              <input
                className={inputClass}
                value={form.travelInfo}
                onChange={(e) =>
                  setForm({ ...form, travelInfo: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">
                เบอร์โทรศัพท์
              </label>
              <input
                className={inputClass}
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-white/70 mb-1">
                Google Maps Link
              </label>
              <input
                className={inputClass}
                value={form.mapUrl}
                onChange={(e) =>
                  setForm({ ...form, mapUrl: e.target.value })
                }
              />
            </div>
          </div>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className={`mt-6 w-full py-3 rounded-xl font-semibold transition
              ${
                loading
                  ? "bg-green-400/60 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-black"
              }`}
          >
            {loading ? "กำลังบันทึก..." : "บันทึกข้อมูลสถานที่"}
          </button>
        </div>
      </div>
    </div>
  );
}
