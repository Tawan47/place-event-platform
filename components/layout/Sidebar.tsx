const stations = [
  "หมอชิต",
  "สะพานควาย",
  "อารีย์",
  "สนามเป้า",
  "อนุสาวรีย์ชัยฯ",
  "พญาไท",
  "ราชเทวี",
  "สยาม",
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-gradient-to-b from-purple-600 via-indigo-600 to-emerald-500 p-4">
      <h1 className="text-xl font-bold mb-6">🚆 Place & Event</h1>

      <nav className="space-y-2">
        {stations.map((name) => (
          <button
            key={name}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/20 transition"
          >
            {name}
          </button>
        ))}
      </nav>
    </aside>
  );
}
