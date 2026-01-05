import CalendarCell from "./CalendarCell";

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

type EventItem = {
  id: string;
  title: string;
  startDate: string;
};

type Props = {
  currentDate: Date;
  events: EventItem[];
  onSelectDay: (day: number) => void;
};

export default function CalendarGrid({
  currentDate,
  events,
  onSelectDay,
}: Props) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const cells = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    return day > 0 && day <= totalDays ? day : null;
  });

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d) => (
        <div key={d} className="text-center text-xs text-white/60">
          {d}
        </div>
      ))}

      {cells.map((day, i) => {
        const dayEvents =
          day == null
            ? []
            : events.filter(
                (e) => new Date(e.startDate).getDate() === day
              );

        return (
          <CalendarCell
            key={i}
            day={day}
            events={dayEvents}
            onClick={onSelectDay}
          />
        );
      })}
    </div>
  );
}
