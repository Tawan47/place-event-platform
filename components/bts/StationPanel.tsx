import BTSLine from "@/components/bts/BTSLine";
import { BTS_SUKHUMVIT } from "@/data/stations";
import { useState } from "react";

export default function StationPanel() {
  const [activeStation, setActiveStation] = useState("CEN");

  return (
    <BTSLine
      stations={BTS_SUKHUMVIT}
      active={activeStation}
      onSelect={setActiveStation}
    />
  );
}
