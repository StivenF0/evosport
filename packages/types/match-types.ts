export type MatchStatus = "agendado" | "em_andamento" | "encerrado";

export interface Match {
  id: number;
  eventId: number;
  homeTeamId: number;
  awayTeamId: number;
  stadiumId: number;
  date: Date;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
}

export type NewMatch = Omit<Match, "id" | "status"> & {
  status?: MatchStatus;
};

export type UpdateMatch = Partial<Omit<Match, "id">>;
