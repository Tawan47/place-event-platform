"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
};

export default function CalendarHeader({
  currentDate,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-green-400">
        {currentDate.toLocaleDateString("th-TH", {
          month: "long",
          year: "numeric",
        })}
      </h2>

      <div className="flex gap-2">
        <button
          onClick={onPrev}
          className="p-2 rounded bg-white/5 hover:bg-white/10"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={onNext}
          className="p-2 rounded bg-white/5 hover:bg-white/10"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
