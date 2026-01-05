"use client";

import Link from "next/link";

export default function AdminTabs({
  active,
}: {
  active: "places" | "events";
}) {
  return (
    <div className="flex justify-center gap-2">
      <Tab
        label="จัดการสถานที่ (Places)"
        href="/admin/places"
        active={active === "places"}
      />
      <Tab
        label="จัดการกิจกรรม (Events)"
        href="/admin/events"
        active={active === "events"}
      />
    </div>
  );
}

function Tab({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-5 py-2 rounded-full text-sm font-medium transition
        ${
          active
            ? "bg-green-500 text-black shadow-md"
            : "bg-white/10 text-white/70 hover:bg-white/20"
        }`}
    >
      {label}
    </Link>
  );
}
