export interface RankingEntry {
  teamId: number;
  teamName: string;
  flagUrl: string | null;
  points: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export type Ranking = RankingEntry[];
