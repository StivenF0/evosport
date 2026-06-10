import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { matchRepository } from "@api/repositories/match-repository";
import { matchService } from "@api/services/match-service";

// Tests
describe("MatchService - Create Match", () => {
  beforeEach(() => {
    spyOn(matchRepository, "create").mockRestore();
  });

  it("should create a new match.", async () => {
    spyOn(matchRepository, "create").mockResolvedValue({
      id: 1,
      status: "em_andamento",
      eventId: 1,
      homeTeamId: 1,
      awayTeamId: 2,
      stadiumId: 1,
      date: new Date("2026-06-20"),
      homeScore: null,
      awayScore: null,
    });

    const match = await matchService.createMatch({
      status: "em_andamento",
      eventId: 1,
      homeTeamId: 1,
      awayTeamId: 2,
      stadiumId: 1,
      date: new Date("2026-06-20"),
      homeScore: null,
      awayScore: null,
    });

    expect(match).not.toBeNull();
    expect(match?.id).toBe(1);
    expect(match?.homeTeamId).toBe(1);
    expect(match?.awayTeamId).toBe(2);
  });

  it("should throw an error if match failed to be created.", async () => {
    spyOn(matchRepository, "create").mockRejectedValue(Error());

    const match = matchService.createMatch({
      status: "em_andamento",
      eventId: 1,
      homeTeamId: 3,
      awayTeamId: 4,
      stadiumId: 2,
      date: new Date("2026-06-20"),
      homeScore: null,
      awayScore: null,
    });

    expect(match).rejects.toThrow("Erro ao criar a partida.");
  });
});

describe("MatchService - Find By Id", () => {
  beforeEach(() => {
    spyOn(matchRepository, "findById").mockRestore();
  });

  it("should find an match by id.", async () => {
    spyOn(matchRepository, "findById").mockResolvedValue({
      id: 1,
      eventId: 1,
      homeTeamId: 1,
      awayTeamId: 2,
      stadiumId: 2,
      date: new Date("2026-06-12"),
      status: "agendado",
      homeScore: null,
      awayScore: null,
      homeTeam: {
        id: 1,
        name: "Brasil",
        flagUrl: "link",
      },
      awayTeam: {
        id: 2,
        name: "Argentina",
        flagUrl: "link",
      },
      stadium: {
        id: 2,
        name: "Maracanã",
        city: "Rio de Janeiro",
        capacity: 78000,
        latitude: -22.91,
        longitude: -43.23,
      },
    });

    const match = await matchService.getMatchById(1);

    expect(match).not.toBeNull();
    expect(match?.id).toBe(1);
    expect(match?.homeTeamId).toBe(1);
    expect(match?.awayTeamId).toBe(2);
  });

  it("should throw an error if no match was found.", async () => {
    spyOn(matchRepository, "findById").mockRejectedValue(Error());

    const match = matchService.getMatchById(10);

    expect(match).rejects.toThrow("Erro ao buscar a partida específica.");
  });
});

describe("MatchService - Get All", () => {
  beforeEach(() => {
    spyOn(matchRepository, "getAllWithTeams").mockRestore();
  });

  it("should return all matches.", async () => {
    spyOn(matchRepository, "getAllWithTeams").mockResolvedValue([
      {
        id: 1,
        eventId: 1,
        homeTeamId: 1,
        awayTeamId: 2,
        stadiumId: 2,
        date: new Date("2026-06-12"),
        status: "agendado",
        homeScore: null,
        awayScore: null,
        homeTeam: {
          id: 1,
          name: "Brasil",
          flagUrl: "link",
        },
        awayTeam: {
          id: 2,
          name: "Argentina",
          flagUrl: "link",
        },
        stadium: {
          id: 2,
          name: "Maracanã",
          city: "Rio de Janeiro",
          capacity: 78000,
          latitude: -22.91,
          longitude: -43.23,
        },
      },
    ]);

    const matches = await matchService.getAllMatches();

    expect(matches).not.toBeArrayOfSize(0);
    expect(matches[0]?.id).toBe(1);
    expect(matches[0]?.status).toBe("agendado");
  });

  it("should throw an error if no match was found.", async () => {
    spyOn(matchRepository, "getAllWithTeams").mockRejectedValue(Error());

    const event = matchService.getAllMatches();

    expect(event).rejects.toThrow("Erro ao buscar as partidas.");
  });
});

describe("MatchService - Update Match", () => {
  beforeEach(() => {
    spyOn(matchRepository, "update").mockRestore();
  });

  it("should update an match.", async () => {
    spyOn(matchRepository, "update").mockResolvedValue({
      id: 1,
      status: "encerrado",
      eventId: 1,
      homeTeamId: 1,
      awayTeamId: 2,
      stadiumId: 1,
      date: new Date("2026-06-20"),
      homeScore: null,
      awayScore: null,
    });

    const match = await matchService.updateMatch(1, { status: "encerrado" });

    expect(match).not.toBeArrayOfSize(0);
    expect(match?.id).toBe(1);
    expect(match?.status).toBe("encerrado");
  });

  it("should throw an error if no match was found for update.", async () => {
    spyOn(matchRepository, "update").mockRejectedValue(Error());

    const event = matchService.updateMatch(10, { status: "encerrado" });

    expect(event).rejects.toThrow("Erro ao atualizar a partida.");
  });
});

describe("MatchService - Delete Match", () => {
  beforeEach(() => {
    spyOn(matchRepository, "delete").mockRestore();
  });

  it("should delete a new match.", async () => {
    spyOn(matchRepository, "delete").mockResolvedValue({
      id: 1,
      status: "em_andamento",
      eventId: 1,
      homeTeamId: 1,
      awayTeamId: 2,
      stadiumId: 1,
      date: new Date("2026-06-20"),
      homeScore: null,
      awayScore: null,
    });

    const match = await matchService.deleteMatch(1);

    expect(match).not.toBeNull();
    expect(match?.id).toBe(1);
    expect(match?.homeTeamId).toBe(1);
    expect(match?.awayTeamId).toBe(2);
  });

  it("should throw an error if no match was found for delete.", async () => {
    spyOn(matchRepository, "delete").mockRejectedValue(Error());

    const match = matchService.deleteMatch(1);

    expect(match).rejects.toThrow("Erro ao excluir a partida.");
  });
});

describe("MatchService - Group By Date", () => {
  beforeEach(() => {
    spyOn(matchService, "getAllMatches").mockRestore();
  });

  it("should return matches grouped by date.", async () => {
    spyOn(matchService, "getAllMatches").mockResolvedValue([
      {
        id: 1,
        eventId: 1,
        homeTeamId: 1,
        awayTeamId: 2,
        stadiumId: 2,
        date: new Date("2026-06-12"),
        status: "agendado",
        homeScore: null,
        awayScore: null,
        homeTeam: {
          id: 1,
          name: "Brasil",
          flagUrl: "link",
        },
        awayTeam: {
          id: 2,
          name: "Argentina",
          flagUrl: "link",
        },
        stadium: {
          id: 2,
          name: "Maracanã",
          city: "Rio de Janeiro",
          capacity: 78000,
          latitude: -22.91,
          longitude: -43.23,
        },
        formattedDate: "15/06/2026",
      },
    ]);

    const matches = await matchService.getMatchesGroupedByDate();

    expect(matches).toHaveProperty("15/06/2026");
  });

  it("should throw an error if no match was found.", async () => {
    spyOn(matchService, "getMatchesGroupedByDate").mockRejectedValue(Error());

    const match = matchService.getMatchesGroupedByDate();

    expect(match).rejects.toThrow();
  });
});

describe("MatchService - Group By Stadium", () => {
  beforeEach(() => {
    spyOn(matchService, "getAllMatches").mockRestore();
  });

  it("should return matches grouped by stadium.", async () => {
    spyOn(matchService, "getAllMatches").mockResolvedValue([
      {
        id: 1,
        eventId: 1,
        homeTeamId: 1,
        awayTeamId: 2,
        stadiumId: 2,
        date: new Date("2026-06-12"),
        status: "agendado",
        homeScore: null,
        awayScore: null,
        homeTeam: {
          id: 1,
          name: "Brasil",
          flagUrl: "link",
        },
        awayTeam: {
          id: 2,
          name: "Argentina",
          flagUrl: "link",
        },
        stadium: {
          id: 2,
          name: "Maracanã",
          city: "Rio de Janeiro",
          capacity: 78000,
          latitude: -22.91,
          longitude: -43.23,
        },
        formattedDate: "15/06/2026",
      },
    ]);

    const matches = await matchService.getMatchesGroupedByStadium();

    expect(matches).toHaveProperty("Maracanã");
  });

  it("should throw an error if no match was found.", async () => {
    spyOn(matchService, "getMatchesGroupedByDate").mockRejectedValue(Error());

    const match = matchService.getMatchesGroupedByDate();

    expect(match).rejects.toThrow();
  });
});
