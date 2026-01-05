import { prisma } from "@/lib/prisma";

export default async function Page() {
  const places = await prisma.place.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>📍 สถานที่ทั้งหมด</h1>

      {places.length === 0 && <p>ยังไม่มีสถานที่</p>}

      {places.map((place) => (
        <div
          key={place.id}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            marginBottom: 12,
            borderRadius: 8,
          }}
        >
          <h3>{place.name}</h3>

          {place.station && <p>🚆 {place.station}</p>}
          {place.travelInfo && <p>{place.travelInfo}</p>}
        </div>
      ))}
    </main>
  );
}
