export interface Event {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  logoUrl: string | null;
}

export type NewEvent = Omit<Event, "id" | "logoUrl"> & {
  logoUrl?: string | null;
};

export type UpdateEvent = Partial<Omit<Event, "id">>;
