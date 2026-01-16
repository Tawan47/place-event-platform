"use client";

import { useEffect, useState, Suspense } from "react";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const inputClass =
  "w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white " +
  "placeholder-white/50 focus:outline-none focus:ring-2 " +
  "focus:ring-green-400/60 focus:border-green-400 transition";

function AdminPlacesForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [form, setForm] = useState({
    name: "",
    category: "Cafe",
    description: "",
    station: "",
    openTime: "",
    travelInfo: "",
    phone: "",
    mapUrl: "",
    facebook: "",
    line: "",
    instagram: "",
    website: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (editId) {
      fetchPlace(editId);
    }
  }, [editId]);

  async function fetchPlace(id: string) {
    try {
      setFetching(true);
      const res = await fetch(`/api/admin/places/${id}`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setForm({
        name: data.name || "",
        category: data.category || "Cafe",
        description: data.description || "",
        station: data.station || "",
        openTime: data.openTime || "",
        travelInfo: data.travelInfo || "",
        phone: data.phone || "",
        mapUrl: data.mapUrl || "",
        facebook: data.facebook || "",
        line: data.line || "",
        instagram: data.instagram || "",
        website: data.website || "",
      });
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถดึงข้อมูลสถานที่ได้");
    } finally {
      setFetching(false);
    }
  }

  async function handleSubmit() {
    if (!form.name || !form.station) {
      alert("กรุณากรอกชื่อสถานที่ และเลือกสถานี");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("station", form.station);
      formData.append("openTime", form.openTime);
      formData.append("travelInfo", form.travelInfo);
      formData.append("phone", form.phone);
      formData.append("mapUrl", form.mapUrl);
      formData.append("facebook", form.facebook);
      formData.append("line", form.line);
      formData.append("instagram", form.instagram);
      formData.append("website", form.website);

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const url = editId ? `/api/admin/places/${editId}` : "/api/admin/places";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Save place failed");
      }

      alert(editId ? "แก้ไขข้อมูลสำเร็จ ✅" : "บันทึกข้อมูลสำเร็จ ✅");

      if (editId) {
        router.push("/admin/places");
      } else {
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
          facebook: "",
          line: "",
          instagram: "",
          website: "",
        });
        setImageFiles([]);
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการบันทึก ❌");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center p-20">
        <p className="text-white/50">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          {editId ? "✏️ แก้ไขสถานที่" : "🏢 เพิ่มสถานที่ใหม่"}
        </h2>
        <p className="text-white/60 text-sm mt-1">
          {editId ? "แก้ไขข้อมูลสถานที่ในระบบ" : "กรอกข้อมูลสถานที่เพื่อใช้ในระบบ Event & Place"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-white/70 mb-1">ชื่อสถานที่</label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">หมวดหมู่</label>
          <select
            className={inputClass}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="Cafe">☕ Cafe</option>
            <option value="Park">🌳 Park</option>
            <option value="Museum">🏛 Museum</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-white/70 mb-1">รายละเอียดสถานที่</label>
          <textarea
            className={`${inputClass} h-32`}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">สถานีรถไฟฟ้า</label>
          <select
            className={inputClass}
            value={form.station}
            onChange={(e) => setForm({ ...form, station: e.target.value })}
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

        <div>
          <label className="block text-sm text-white/70 mb-1">
            รูปภาพ {editId ? "(เลือกใหม่จะลบรูปเก่า)" : "(เลือกได้หลายรูป)"}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            className={inputClass}
            onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
          />

          {imageFiles.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {imageFiles.map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${i}`}
                  className="h-24 w-full object-cover rounded-lg border border-white/20"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">เวลาเปิด–ปิด</label>
          <input
            className={inputClass}
            value={form.openTime}
            onChange={(e) => setForm({ ...form, openTime: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">การเดินทาง</label>
          <input
            className={inputClass}
            value={form.travelInfo}
            onChange={(e) => setForm({ ...form, travelInfo: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">เบอร์โทรศัพท์</label>
          <input
            className={inputClass}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">Facebook</label>
          <input
            className={inputClass}
            value={form.facebook}
            onChange={(e) => setForm({ ...form, facebook: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">Line</label>
          <input
            className={inputClass}
            value={form.line}
            onChange={(e) => setForm({ ...form, line: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">Instagram</label>
          <input
            className={inputClass}
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">Website</label>
          <input
            className={inputClass}
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-white/70 mb-1">Google Maps Link</label>
          <input
            className={inputClass}
            value={form.mapUrl}
            onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        {editId && (
          <button
            type="button"
            onClick={() => router.push("/admin/places")}
            className="flex-1 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 transition"
          >
            ยกเลิก
          </button>
        )}
        <button
          disabled={loading}
          onClick={handleSubmit}
          className={`flex-[2] py-3 rounded-xl font-semibold transition
            ${loading ? "bg-green-400/60 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-black"}`}
        >
          {loading ? "กำลังบันทึก..." : editId ? "บันทึกการแก้ไข" : "บันทึกข้อมูลสถานที่"}
        </button>
      </div>
    </div>
  );
}

export default function AdminPlacesPage() {
  return (
    <AdminLayout>
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

          <Suspense fallback={<div className="text-center p-20">Loading form...</div>}>
            <AdminPlacesForm />
          </Suspense>
        </div>
      </div>
    </AdminLayout>
  );
}