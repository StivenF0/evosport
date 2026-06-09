import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { rankingRoutes } from "@api/routes/ranking-routes";
import { rankingService } from "@api/services/ranking-service";
import { Elysia } from "elysia";

const app = new Elysia().use(rankingRoutes);
const req = (p: string, o?: RequestInit) =>
  app.handle(new Request(`http://localhost/ranking${p}`, o));

describe("RankingRoutes", () => {
  afterEach(() => mock.restore());

  const validRankingStats = {
    id: 1,
    name: "Brasil",
    flagUrl: null,
    played: 3,
    points: 9,
    wins: 3,
    draws: 0,
    losses: 0,
    goalsFor: 6,
    goalsAgainst: 1,
    goalDifference: 5,
  };

  it("GET / - should return calculated ranking", async () => {
    spyOn(rankingService, "getRanking").mockResolvedValue([validRankingStats]);
    const res = await req("/");
    expect(res.status).toBe(200);
    // biome-ignore lint/suspicious/noExplicitAny: mock em teste
    const json: any = await res.json();
    expect(json[0].name).toBe("Brasil");
  });

  it("GET / - should return 500 on error", async () => {
    spyOn(rankingService, "getRanking").mockRejectedValue(new Error());
    expect((await req("/")).status).toBe(500);
  });
});
