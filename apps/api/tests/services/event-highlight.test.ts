import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { eventService } from "@api/services/event-service";
import { matchService } from "@api/services/match-service";

// biome-ignore lint/suspicious/noExplicitAny: mock simplificado de partida em teste
const match = (over: Record<string, unknown>): any => ({
  id: 1,
  eventId: 1,
  homeTeamId: 1,
  awayTeamId: 2,
  stadiumId: 1,
  status: "agendado",
  homeScore: null,
  awayScore: null,
  formattedDate: "01/01/2030",
  ...over,
});

describe("EventService.getHighlightMatch", () => {
  afterEach(() => mock.restore());

  it("prioriza a partida em andamento", async () => {
    spyOn(matchService, "getMatchesByEvent").mockResolvedValue([
      match({ id: 1, status: "agendado", date: new Date("2030-01-01") }),
      match({ id: 2, status: "em_andamento", date: new Date("2020-01-01") }),
    ]);
    const result = await eventService.getHighlightMatch(1);
    expect(result?.id).toBe(2);
  });

  it("sem partida em andamento, retorna o próximo agendado mais próximo", async () => {
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const farther = new Date(Date.now() + 1000 * 60 * 60 * 48);
    spyOn(matchService, "getMatchesByEvent").mockResolvedValue([
      match({ id: 3, status: "agendado", date: farther }),
      match({ id: 4, status: "agendado", date: future }),
    ]);
    const result = await eventService.getHighlightMatch(1);
    expect(result?.id).toBe(4);
  });

  it("retorna null quando não há partidas em destaque", async () => {
    spyOn(matchService, "getMatchesByEvent").mockResolvedValue([
      match({ id: 5, status: "encerrado", date: new Date("2020-01-01") }),
    ]);
    const result = await eventService.getHighlightMatch(1);
    expect(result).toBeNull();
  });
});
