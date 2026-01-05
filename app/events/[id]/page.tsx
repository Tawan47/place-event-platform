import { prisma } from "@/lib/prisma";

type Props = {
  params: {
    id: string;
  };
};

export default async function PlaceDetailPage({ params }: Props) {
  const place = await prisma.place.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!place) {
    return <div className="p-8 text-white">ไม่พบสถานที่</div>;
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold">{place.name}</h1>
      <p className="text-white/70 mt-2">{place.description}</p>
    </div>
  );
}
