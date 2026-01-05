"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function GoogleMapPicker({
  lat,
  lng,
  onChange,
}: {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="rounded-xl overflow-hidden border border-white/10">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: 300 }}
        center={{ lat, lng }}
        zoom={15}
        onClick={(e) =>
          onChange(e.latLng!.lat(), e.latLng!.lng())
        }
      >
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    </div>
  );
}
