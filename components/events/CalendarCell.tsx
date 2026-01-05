type EventItem = {
  id: string;
  title: string;
};

type Props = {
  day: number | null;
  events?: EventItem[];
  onClick: (day: number) => void;
};

export default function CalendarCell({ day, events, onClick }: Props) {
  return (
    <div
      onClick={() => day !== null && onClick(day)}
      className="h-24 rounded-lg border border-white/10 p-2 hover:bg-white/5 cursor-pointer"
    >
      <div className="text-sm text-white/70">{day}</div>

      {events?.map((ev) => (
        <div
          key={ev.id}
          className="mt-1 text-xs text-green-400 truncate"
        >
          {ev.title}
        </div>
      ))}
    </div>
  );
}
