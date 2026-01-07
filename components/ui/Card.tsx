import Link from "next/link";
import { Clock, MapPin } from "lucide-react";

type Props = {
  id: string;
  title: string;
  tag: string;
  time: string;
  image?: string;
  station?: string; // Added station prop

  description?: string;
  travelInfo?: string;
  phone?: string;
  mapUrl?: string;
};

export default function PlaceCard({
  id,
  title,
  tag,
  time,
  image,
  station,
}: Props) {
  return (
    <Link
      href={`/places/${id}`}
      className="
        group
        relative
        flex flex-col
        w-full
        aspect-[4/5]
        rounded-3xl
        overflow-hidden
        bg-white/5
        border border-white/10
        shadow-lg
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      {/* Image Background */}
      <div className="absolute inset-0 z-0">
        {image ? (
          <img
            src={image}
            alt={title}
            className="
              h-full w-full
              object-cover
              group-hover:scale-110
              transition-transform duration-700
            "
          />
        ) : (
          <div className="h-full w-full bg-neutral-800 flex items-center justify-center">
            <span className="text-white/20 text-4xl font-bold">No Image</span>
          </div>
        )}
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <span className="px-3 py-1 text-xs font-semibold bg-white/20 backdrop-blur-md rounded-full text-white border border-white/10">
          {tag}
        </span>
        {station && (
          <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-green-500/80 backdrop-blur-md rounded-full text-white shadow-lg">
            <MapPin size={12} />
            {station}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 w-full p-5 z-10 flex flex-col gap-1">
        <h3 className="text-white font-bold text-2xl leading-tight line-clamp-2 drop-shadow-md">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
          <Clock size={14} className="text-green-400" />
          <span>{time}</span>
        </div>
      </div>
    </Link>
  );
}
