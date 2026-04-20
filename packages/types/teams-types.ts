import { teams } from "@api/db/schema";

export type NewTeam = typeof teams.$inferInsert;
export type UpdateTeam = Partial<NewTeam>;
