import { stadiums } from "@api/db/schema";

export type NewVenue = typeof stadiums.$inferInsert;
export type UpdateVenue = Partial<NewVenue>;
