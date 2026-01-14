import { TrainFront } from "lucide-react";

type Props = {
  name: string;
  code: string;
  top: number;
  active?: boolean;
  onClick?: () => void;
};

export default function StationNode({
  name,
  code,
  top,
  active,
  onClick,
}: Props) {
  const size = active ? 36 : 24; // 🔥 Active ใหญ่ขึ้น + เป็นรูปรถไฟ
  const dotOffset = 34;          // ต้องตรงกับ BTSMap

  return (
    <div
      onClick={onClick}
      className="absolute left-0 flex items-start cursor-pointer group"
      style={{ top }}
    >
      {/* DOT + CODE (centered) */}
      <div
        className={`
          relative z-10 flex items-center justify-center
          rounded-full font-bold
          transition-all duration-300 shadow-md
          ${active
            ? "bg-green-500 text-black scale-110 ring-4 ring-green-500/30"
            : "bg-white text-black hover:scale-110"
          }
        `}
        style={{
          width: size,
          height: size,
          marginLeft: dotOffset,
        }}
      >
        {active ? (
          <TrainFront size={20} strokeWidth={2.5} />
        ) : (
          <span className="text-[10px] leading-none">{code}</span>
        )}
      </div>

      {/* TEXT (ชื่อสถานี) */}
      <div
        className={`ml-6 leading-tight transition-colors
          ${active ? "text-green-400 font-semibold" : "text-white/80"}
        `}
      >
        <div className="text-sm whitespace-nowrap">{name}</div>
      </div>
    </div>
  );
}
