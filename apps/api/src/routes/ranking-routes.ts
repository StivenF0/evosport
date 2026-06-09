import { Elysia } from "elysia";
import { RankingResponse } from "../schemas/ranking-schemas";
import { ErrorResponse } from "../schemas/shared-schemas";
import { rankingService } from "../services/ranking-service";

export const rankingRoutes = new Elysia({ prefix: "/ranking" })
  // READ (Calculated Ranking - UC04)
  .get(
    "/",
    async () => {
      try {
        return await rankingService.getRanking();
      } catch {
        throw new Error("Erro ao gerar a tabela de classificação.");
      }
    },
    {
      response: {
        200: RankingResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Obter tabela de classificação",
        description:
          "Retorna a lista de times ordenada por pontos, vitórias e saldo de gols (UC04).",
        tags: ["Ranking"],
      },
    },
  );
