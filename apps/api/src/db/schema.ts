import type { MatchStatus, UserRole } from "@packages/types";
import { relations, sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").$type<UserRole>().notNull().default("user"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const event = sqliteTable("event", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  logoUrl: text("logo_url"),
});

export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  flagUrl: text("flag_url"),
});

export const stadiums = sqliteTable("stadiums", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  city: text("city").notNull(),
  capacity: integer("capacity"),
  latitude: real("latitude"),
  longitude: real("longitude"),
});

export const matches = sqliteTable("matches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: integer("event_id")
    .notNull()
    .references(() => event.id),
  homeTeamId: integer("home_team_id")
    .notNull()
    .references(() => teams.id),
  awayTeamId: integer("away_team_id")
    .notNull()
    .references(() => teams.id),
  stadiumId: integer("stadium_id")
    .notNull()
    .references(() => stadiums.id),
  date: integer("date", { mode: "timestamp" }).notNull(),
  status: text("status").$type<MatchStatus>().notNull().default("agendado"),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
});

// Tabelas de junção (N:N) — times e sedes são compartilhados entre eventos
export const eventTeams = sqliteTable("event_teams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: integer("event_id")
    .notNull()
    .references(() => event.id),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
});

export const eventStadiums = sqliteTable("event_stadiums", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: integer("event_id")
    .notNull()
    .references(() => event.id),
  stadiumId: integer("stadium_id")
    .notNull()
    .references(() => stadiums.id),
});

// Definição de relações para facilitar as consultas (joins) no Drizzle
export const eventRelations = relations(event, ({ many }) => ({
  matches: many(matches),
  eventTeams: many(eventTeams),
  eventStadiums: many(eventStadiums),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  eventTeams: many(eventTeams),
}));

export const stadiumsRelations = relations(stadiums, ({ many }) => ({
  eventStadiums: many(eventStadiums),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  event: one(event, {
    fields: [matches.eventId],
    references: [event.id],
  }),
  homeTeam: one(teams, {
    fields: [matches.homeTeamId],
    references: [teams.id],
    relationName: "homeTeam",
  }),
  awayTeam: one(teams, {
    fields: [matches.awayTeamId],
    references: [teams.id],
    relationName: "awayTeam",
  }),
  stadium: one(stadiums, {
    fields: [matches.stadiumId],
    references: [stadiums.id],
  }),
}));

export const eventTeamsRelations = relations(eventTeams, ({ one }) => ({
  event: one(event, {
    fields: [eventTeams.eventId],
    references: [event.id],
  }),
  team: one(teams, {
    fields: [eventTeams.teamId],
    references: [teams.id],
  }),
}));

export const eventStadiumsRelations = relations(eventStadiums, ({ one }) => ({
  event: one(event, {
    fields: [eventStadiums.eventId],
    references: [event.id],
  }),
  stadium: one(stadiums, {
    fields: [eventStadiums.stadiumId],
    references: [stadiums.id],
  }),
}));
