"use client";
import { useEffect, useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import EventSidePanel from "./EventSidePanel";

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    fetch(
      `/api/events?month=${currentDate.getMonth()}&year=${currentDate.getFullYear()}`
    )
      .then((res) => res.json())
      .then(setEvents);
  }, [currentDate]);

  return (
    <div className="space-y-4">
      {/* ✅ ปุ่มเลื่อนเดือน */}
      <CalendarHeader
        currentDate={currentDate}
        onPrev={() =>
          setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
          )
        }
        onNext={() =>
          setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
          )
        }
      />

      <CalendarGrid
        currentDate={currentDate}
        events={events}
        onSelectDay={setSelectedDay}
      />

      <EventSidePanel
        date={selectedDay}
        events={events.filter(
          (e) => new Date(e.startDate).getDate() === selectedDay
        )}
        onClose={() => setSelectedDay(null)}
      />
    </div>
  );
}
