export interface Venue {
  id: number;
  name: string;
  city: string;
  capacity: number | null;
  latitude: number | null;
  longitude: number | null;
}

export type NewVenue = Omit<Venue, "id" | "capacity" | "latitude" | "longitude"> & {
  capacity?: number | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type UpdateVenue = Partial<Omit<Venue, "id">>;
