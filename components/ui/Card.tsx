import Link from "next/link";

type Props = {
  id: string;
  title: string;
  tag: string;
  time: string;
  image?: string;

  description?: string;
  station?: string;
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
  description,
  mapUrl,
}: Props) {
  return (
    <Link
      href={`/places/${id}`}
      className="
        group
        relative
        w-[260px]
        h-[360px]
        rounded-2xl
        overflow-hidden
        bg-white/5
        border border-white/10
        hover:scale-[1.02]
        transition
      "
    >
      {/* Image */}
      {image && (
        <img
          src={image}
          alt={title}
          className="
            absolute inset-0
            h-full w-full
            object-cover
            group-hover:scale-105
            transition-transform duration-500
          "
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 p-4">
        <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2">
          {title}
        </h3>

        <p className="text-green-400 text-sm mt-1">
          {tag}
        </p>

        <p className="text-white/70 text-sm mt-1">
          {time}
        </p>
      </div>
    </Link>
  );
}
