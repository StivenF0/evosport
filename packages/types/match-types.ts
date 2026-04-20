import { matches } from "@api/db/schema";

export type NewMatch = typeof matches.$inferInsert;
export type UpdateMatch = Partial<NewMatch>;
