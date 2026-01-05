export type PlaceDTO = {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  station: string;
  imageUrl?: string | null;
  openTime?: string | null;
  travelInfo?: string | null;
  phone?: string | null;
  mapUrl?: string | null;

};
