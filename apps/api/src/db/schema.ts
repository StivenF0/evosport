import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const event = sqliteTable('event', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  logoUrl: text('logo_url'),
});

export const teams = sqliteTable('teams', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  flagUrl: text('flag_url'),
});

export const stadiums = sqliteTable('stadiums', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  city: text('city').notNull(),
  capacity: integer('capacity'),
  latitude: real('latitude'),
  longitude: real('longitude'),
});

export const matches = sqliteTable('matches', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  homeTeamId: integer('home_team_id').notNull().references(() => teams.id),
  awayTeamId: integer('away_team_id').notNull().references(() => teams.id),
  stadiumId: integer('stadium_id').notNull().references(() => stadiums.id),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  status: text('status').notNull().default('agendado'), // status: 'agendado', 'em_andamento', 'encerrado'
});

// Definição de relações para facilitar as consultas (joins) no Drizzle
export const matchesRelations = relations(matches, ({ one }) => ({
  homeTeam: one(teams, {
    fields: [matches.homeTeamId],
    references: [teams.id],
    relationName: 'homeTeam',
  }),
  awayTeam: one(teams, {
    fields: [matches.awayTeamId],
    references: [teams.id],
    relationName: 'awayTeam',
  }),
  stadium: one(stadiums, {
    fields: [matches.stadiumId],
    references: [stadiums.id],
  }),
}));
