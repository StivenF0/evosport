import { eq } from 'drizzle-orm';
import { db } from '../db';
import { matches } from '../db/schema';

export const rankingRepository = {
  // READ (All Finished Matches for Ranking Calculation)
  async getFinishedMatches() {
    try {
      return await db.query.matches.findMany({
        where: eq(matches.status, 'encerrado'),
        with: {
          homeTeam: true,
          awayTeam: true,
        },
      });
    } catch (error) {
      throw new Error('Erro ao buscar partidas finalizadas para a classificação.');
    }
  },

  // READ (Finished Matches filtered by Stadium/Phase if needed in the future)
  async getFinishedMatchesByStadium(stadiumId: number) {
    try {
      const result = await db.query.matches.findMany({
        where: (matches, { and, eq }) =>
          and(
            eq(matches.status, 'encerrado'),
            eq(matches.stadiumId, stadiumId)
          ),
        with: {
          homeTeam: true,
          awayTeam: true,
        },
      });
      return result;
    } catch (error) {
      throw new Error('Erro ao buscar partidas finalizadas por estádio.');
    }
  }
};
