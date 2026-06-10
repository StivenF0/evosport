import type {
  Event as BaseEvent,
  Match as BaseMatch,
  Team as BaseTeam,
  User as BaseUser,
  Venue as BaseVenue,
  MatchStatus,
  NewEvent,
  NewMatch,
  NewTeam,
  NewVenue,
  UpdateEvent,
  UpdateMatch,
  UpdateTeam,
  UpdateVenue,
  UserRole,
} from "@packages/types";

/**
 * Re-exporting base types for convenience
 */
export type {
  MatchStatus,
  NewEvent,
  NewMatch,
  NewTeam,
  NewVenue,
  UpdateEvent,
  UpdateMatch,
  UpdateTeam,
  UpdateVenue,
  UserRole,
};

/**
 * Authenticated user (API returns createdAt as ISO string)
 */
export interface User extends Omit<BaseUser, "createdAt"> {
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface MessageResponse {
  message: string;
}

/**
 * API Responses often return Dates as strings (ISO format)
 */
export interface Event extends Omit<BaseEvent, "startDate" | "endDate"> {
  startDate: string;
  endDate: string;
}

export interface Team extends BaseTeam {}

export interface Venue extends BaseVenue {}

/**
 * Match response from API (with relations and formatted date)
 */
export interface Match extends Omit<BaseMatch, "date"> {
  date: string;
  formattedDate: string;
  homeTeam: Team;
  awayTeam: Team;
  stadium: Venue;
}

/**
 * Grouped Match responses
 */
export type MatchGroupedByDate = Record<string, Match[]>;
export type MatchGroupedByStadium = Record<string, Match[]>;

/**
 * Ranking / Team Stats response
 */
export interface TeamStats {
  id: number;
  name: string;
  flagUrl: string | null;
  played: number;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export type Ranking = TeamStats[];

/**
 * Shared API response types
 */
export interface ErrorResponse {
  message: string;
}
