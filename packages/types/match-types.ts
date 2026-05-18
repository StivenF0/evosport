export type MatchStatus = "agendado" | "em_andamento" | "encerrado";

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  stadiumId: number;
  date: Date;
  status: MatchStatus;
}

export type NewMatch = Omit<Match, "id" | "status"> & {
  status?: MatchStatus;
};

export type UpdateMatch = Partial<Omit<Match, "id">>;
