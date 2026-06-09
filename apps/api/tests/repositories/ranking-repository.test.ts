import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { db } from "@api/db";
import { rankingRepository } from "@api/repositories/ranking-repository";

describe("RankingRepository - Get Finished Matches", () => {
  beforeEach(() => {
    // Configura o objeto db.query caso não exista no ambiente de teste
    if (!db.query) db.query = { matches: {} } as any;
    spyOn(db.query.matches as any, "findMany").mockRestore();
  });

  it("should return all finished matches.", async () => {
    spyOn(db.query.matches as any, "findMany").mockResolvedValue([
      {
        id: 1,
        status: "encerrado",
        homeTeam: { name: "Brasil" },
        awayTeam: { name: "Argentina" },
      },
    ]);

    const matches = await rankingRepository.getFinishedMatches();

    expect(matches).toBeArrayOfSize(1);
    expect((matches[0] as any)?.status).toBe("encerrado");
    expect((matches[0] as any)?.homeTeam?.name).toBe("Brasil");
  });

  it("should throw an error if the query fails.", async () => {
    spyOn(db.query.matches as any, "findMany").mockRejectedValue(new Error());

    const matches = rankingRepository.getFinishedMatches();

    expect(matches).rejects.toThrow("Erro ao buscar partidas finalizadas para a classificação.");
  });
});

describe("RankingRepository - Get Finished Matches By Stadium", () => {
  beforeEach(() => {
    if (!db.query) db.query = { matches: {} } as any;
    spyOn(db.query.matches as any, "findMany").mockRestore();
  });

  it("should return finished matches filtered by stadium.", async () => {
    spyOn(db.query.matches as any, "findMany").mockResolvedValue([
      {
        id: 2,
        status: "encerrado",
        stadiumId: 1,
        homeTeam: { name: "Espanha" },
        awayTeam: { name: "França" },
      },
    ]);

    const matches = await rankingRepository.getFinishedMatchesByStadium(1);

    expect(matches).toBeArrayOfSize(1);
    expect((matches[0] as any)?.stadiumId).toBe(1);
    expect((matches[0] as any)?.homeTeam?.name).toBe("Espanha");
  });

  it("should throw an error if the query fails.", async () => {
    spyOn(db.query.matches as any, "findMany").mockRejectedValue(new Error());

    const matches = rankingRepository.getFinishedMatchesByStadium(1);

    expect(matches).rejects.toThrow("Erro ao buscar partidas finalizadas por estádio.");
  });
});
