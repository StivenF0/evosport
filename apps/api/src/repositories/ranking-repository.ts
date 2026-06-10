import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { matches } from "../db/schema";

export const rankingRepository = {
  // READ (All Finished Matches for Ranking Calculation)
  // Quando `eventId` é informado, restringe a classificação ao evento.
  async getFinishedMatches(eventId?: number) {
    try {
      return await db.query.matches.findMany({
        where: eventId
          ? and(eq(matches.status, "encerrado"), eq(matches.eventId, eventId))
          : eq(matches.status, "encerrado"),
        with: {
          homeTeam: true,
          awayTeam: true,
        },
      });
    } catch {
      throw new Error("Erro ao buscar partidas finalizadas para a classificação.");
    }
  },

  // READ (Finished Matches filtered by Stadium/Phase if needed in the future)
  async getFinishedMatchesByStadium(stadiumId: number) {
    try {
      const result = await db.query.matches.findMany({
        where: (matches, { and, eq }) =>
          and(eq(matches.status, "encerrado"), eq(matches.stadiumId, stadiumId)),
        with: {
          homeTeam: true,
          awayTeam: true,
        },
      });
      return result;
    } catch {
      throw new Error("Erro ao buscar partidas finalizadas por estádio.");
    }
  },
};
