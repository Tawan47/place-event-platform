"use client";

import { useEffect, useState } from "react";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import { X } from "lucide-react";

const inputClass =
  "w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white " +
  "placeholder-white/50 focus:outline-none focus:ring-2 " +
  "focus:ring-green-400/60 focus:border-green-400 transition";

type Event = {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  stationCode: string;
  placeId: string;
  status: string;
};

type Place = {
  id: string;
  name: string;
  station: string;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    stationCode: "",
    placeId: "",
    status: "PUBLISHED",
  });

  async function fetchInitialData() {
    try {
      setLoading(true);
      const [eventsRes, placesRes] = await Promise.all([
        fetch("/api/admin/events"),
        fetch("/api/admin/places")
      ]);
      const eventsData = await eventsRes.json();
      const placesData = await placesRes.json();
      setEvents(eventsData);
      setPlaces(placesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onPlaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedPlace = places.find(p => p.id === selectedId);
    setForm({
      ...form,
      placeId: selectedId,
      stationCode: selectedPlace?.station || ""
    });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const onChange =
    (key: keyof typeof form) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [key]: e.target.value });
      };

  async function handleSubmit() {
    if (!form.title || !form.startDate || !form.endDate || !form.placeId) {
      alert("กรุณากรอกข้อมูลให้ครบ โดยเฉพาะชื่อกิจกรรม วันที่ และเลือกสถานที่");
      return;
    }

    try {
      setSaving(true);
      const url = editId ? `/api/admin/events/${editId}` : "/api/admin/events";
      const method = editId ? "PUT" : "POST";

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);
      formData.append("stationCode", form.stationCode);
      formData.append("placeId", form.placeId);
      formData.append("status", form.status);

      files.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Save event failed");
      }

      alert(editId ? "แก้ไข Event สำเร็จ ✅" : "เพิ่ม Event สำเร็จ ✅");
      resetForm();
      fetchInitialData();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบ Event นี้?")) return;

    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("ลบสำเร็จ");
        fetchInitialData();
      } else {
        alert("ลบไม่สำเร็จ");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  }

  function startEdit(event: Event) {
    setEditId(event.id);
    setForm({
      title: event.title,
      description: event.description || "",
      startDate: new Date(event.startDate).toISOString().split("T")[0],
      endDate: new Date(event.endDate).toISOString().split("T")[0],
      stationCode: event.stationCode,
      placeId: event.placeId,
      status: event.status,
    });
    setFiles([]); // Clear files when starting edit
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditId(null);
    setForm({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      stationCode: "",
      placeId: "",
      status: "PUBLISHED",
    });
    setFiles([]);
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0b1220] to-[#020617] text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="relative flex items-center mb-8">
            <Link href="/" className="text-white/60 hover:text-white transition z-10">
              ← กลับหน้าหลัก
            </Link>
            <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-green-400">
              Admin Dashboard
            </h1>
          </div>

          <div className="mb-8">
            <AdminTabs active="events" />
          </div>

          <div className="max-w-5xl mx-auto rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8 mb-12">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                {editId ? "✏️ แก้ไขกิจกรรม" : "📅 เพิ่มกิจกรรมใหม่"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-white/70 mb-1">ชื่อกิจกรรม</label>
                <input
                  className={inputClass}
                  placeholder="เช่น Music Festival"
                  value={form.title}
                  onChange={onChange("title")}
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">เลือกสถานที่</label>
                <select
                  className={inputClass}
                  value={form.placeId}
                  onChange={onPlaceChange}
                >
                  <option value="">-- เลือกสถานที่ --</option>
                  {places.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.station})</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-white/70 mb-1">รายละเอียดกิจกรรม</label>
                <textarea
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="รายละเอียดกิจกรรม"
                  value={form.description}
                  onChange={onChange("description")}
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">วันที่เริ่ม</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.startDate}
                  onChange={onChange("startDate")}
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">วันที่สิ้นสุด</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.endDate}
                  onChange={onChange("endDate")}
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">สถานะ</label>
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={onChange("status")}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">อัปโหลดรูปภาพ (หลายรูปได้)</label>
                <input
                  type="file"
                  multiple
                  className={inputClass}
                  onChange={onFileChange}
                  accept="image/*"
                />

                {previewUrls.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {previewUrls.map((url, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={url}
                          alt={`preview-${i}`}
                          className="h-24 w-full object-cover rounded-lg border border-white/20"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-4 rounded-2xl bg-white/10 hover:bg-white/20 font-bold transition"
                >
                  ยกเลิก
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-[2] rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-black font-bold py-4 text-lg transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
              >
                {saving ? "กำลังบันทึก..." : editId ? "✅ บันทึกการแก้ไข" : "🚀 บันทึกกิจกรรม"}
              </button>
            </div>
          </div>

          {/* List of Events */}
          <div className="max-w-5xl mx-auto rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">🗓 รายการกิจกรรมทั้งหมด</h2>
            {loading ? (
              <p className="text-center text-white/50">กำลังโหลด...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-white/60 text-sm">
                      <th className="py-4 font-medium px-4">ชื่อกิจกรรม</th>
                      <th className="py-4 font-medium">วันที่</th>
                      <th className="py-4 font-medium">สถานะ</th>
                      <th className="py-4 font-medium text-right px-4">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-white/[0.02] transition">
                        <td className="py-4 px-4 font-medium">{ev.title}</td>
                        <td className="py-4 text-white/70 text-sm">
                          {new Date(ev.startDate).toLocaleDateString()} - {new Date(ev.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${ev.status === "PUBLISHED" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                            {ev.status}
                          </span>
                        </td>
                        <td className="py-4 text-right px-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => startEdit(ev)}
                              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg text-sm transition"
                            >
                              แก้ไข
                            </button>
                            <button
                              onClick={() => handleDelete(ev.id)}
                              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg text-sm transition"
                            >
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {events.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-white/40">
                          ยังไม่มีกิจกรรมในระบบ
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
    </AdminLayout>
  );
}
