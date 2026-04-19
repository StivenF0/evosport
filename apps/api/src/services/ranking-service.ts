import { rankingRepository } from '../repositories/ranking-repository';
import { teams } from '../db/schema';

interface TeamStats {
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

type Team = typeof teams.$inferSelect;

export const rankingService = {
  // READ (Calculated Ranking)
  async getRanking() {
    try {
      const matches = await rankingRepository.getFinishedMatches();
      const rankingMap = new Map<number, TeamStats>();

      // Helper to initialize team stats
      const getTeamStats = (team: Team): TeamStats => {
        if (!rankingMap.has(team.id)) {
          rankingMap.set(team.id, {
            id: team.id,
            name: team.name,
            flagUrl: team.flagUrl,
            played: 0,
            points: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
          });
        }
        return rankingMap.get(team.id)!;
      };

      // Calculate stats iterating over matches
      for (const match of matches) {
        // Os campos homeScore e awayScore serão adicionados na Sprint 3
        const homeScore = (match as any).homeScore ?? 0;
        const awayScore = (match as any).awayScore ?? 0;

        const homeStats = getTeamStats(match.homeTeam);
        const awayStats = getTeamStats(match.awayTeam);

        homeStats.played += 1;
        awayStats.played += 1;

        homeStats.goalsFor += homeScore;
        homeStats.goalsAgainst += awayScore;
        awayStats.goalsFor += awayScore;
        awayStats.goalsAgainst += homeScore;

        if (homeScore > awayScore) {
          homeStats.wins += 1;
          homeStats.points += 3;
          awayStats.losses += 1;
        } else if (homeScore < awayScore) {
          awayStats.wins += 1;
          awayStats.points += 3;
          homeStats.losses += 1;
        } else {
          homeStats.draws += 1;
          homeStats.points += 1;
          awayStats.draws += 1;
          awayStats.points += 1;
        }

        homeStats.goalDifference = homeStats.goalsFor - homeStats.goalsAgainst;
        awayStats.goalDifference = awayStats.goalsFor - awayStats.goalsAgainst;
      }

      // Sort array by Tiebreaker rules (Points > Wins > Goal Difference)
      return Array.from(rankingMap.values()).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.goalDifference - a.goalDifference;
      });

    } catch (error) {
      throw new Error('Erro ao calcular a tabela de classificação.');
    }
  }
};
