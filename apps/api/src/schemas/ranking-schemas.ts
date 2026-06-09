import { t } from "elysia";

/**
 * Schema para as estatísticas de desempenho de um time na classificação.
 */
export const TeamStatsResponse = t.Object({
  id: t.Number({ description: "ID único do time" }),
  name: t.String({ description: "Nome do time" }),
  flagUrl: t.Nullable(t.String({ description: "URL da bandeira do time" })),
  played: t.Number({ description: "Quantidade de partidas jogadas" }),
  points: t.Number({ description: "Total de pontos acumulados" }),
  wins: t.Number({ description: "Quantidade de vitórias" }),
  draws: t.Number({ description: "Quantidade de empates" }),
  losses: t.Number({ description: "Quantidade de derrotas" }),
  goalsFor: t.Number({ description: "Gols marcados" }),
  goalsAgainst: t.Number({ description: "Gols sofridos" }),
  goalDifference: t.Number({ description: "Saldo de gols" }),
});

/**
 * Schema para a lista da tabela de classificação,
 * ordenada por Pontos > Vitórias > Saldo de Gols.
 */
export const RankingResponse = t.Array(TeamStatsResponse, {
  description: "Lista da tabela de classificação ordenada pelos critérios de desempate",
});
