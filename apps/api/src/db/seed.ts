import type { MatchStatus } from "@packages/types";
import { db } from "./index";
import {
  event,
  eventStadiums,
  eventTeams,
  matches,
  stadiums,
  teams,
  userFavorites,
  users,
} from "./schema";

function ensure<T>(value: T | undefined): T {
  if (value == null) throw new Error("Unexpected undefined value");
  return value;
}

async function seed() {
  console.log("🌱 Iniciando o processo de seed...");

  try {
    // 1. Limpeza do banco de dados (evita duplicatas ao re-executar)
    console.log("🧹 Limpando dados antigos...");
    await db.delete(userFavorites);
    await db.delete(matches);
    await db.delete(eventTeams);
    await db.delete(eventStadiums);
    await db.delete(stadiums);
    await db.delete(teams);
    await db.delete(event);
    await db.delete(users);

    // 2. Usuários (admin + alguns usuários comuns para demonstrar favoritos)
    console.log("👤 Inserindo usuários...");
    const insertedUsers = await db
      .insert(users)
      .values([
        {
          name: "Administrador",
          email: "admin@evosport.com",
          passwordHash: await Bun.password.hash("admin123"),
          role: "admin",
        },
        {
          name: "Bruno Almeida",
          email: "bruno@evosport.com",
          passwordHash: await Bun.password.hash("user123"),
          role: "user",
        },
        {
          name: "Carla Dias",
          email: "carla@evosport.com",
          passwordHash: await Bun.password.hash("user123"),
          role: "user",
        },
        {
          name: "Diego Souza",
          email: "diego@evosport.com",
          passwordHash: await Bun.password.hash("user123"),
          role: "user",
        },
      ])
      .returning();

    // 3. Eventos globais
    console.log("🏆 Inserindo eventos...");
    const insertedEvents = await db
      .insert(event)
      .values([
        {
          name: "Copa do Mundo Evosport 2026",
          description:
            "O principal torneio global de seleções, reunindo as melhores equipes do mundo em uma disputa eliminatória ao longo de cinco semanas.",
          startDate: new Date("2026-06-11"),
          endDate: new Date("2026-07-19"),
          logoUrl: "https://i.pinimg.com/736x/63/90/04/63900492a4c38c5b89321260e13c4eda.jpg",
        },
        {
          name: "Copa das Confederações Evosport 2025",
          description:
            "Torneio internacional que reúne os campeões continentais em um confronto de alto nível, servindo de ensaio para a Copa do Mundo.",
          startDate: new Date("2025-08-01"),
          endDate: new Date("2025-08-20"),
          logoUrl: null,
        },
        {
          name: "Liga dos Campeões Evosport 2025/26",
          description:
            "A elite do futebol de clubes em mata-mata continental, dos confrontos de ida e volta até a grande final.",
          startDate: new Date("2025-09-16"),
          endDate: new Date("2026-05-30"),
          logoUrl: null,
        },
        {
          name: "Copa Continental Evosport 2024",
          description:
            "Edição encerrada do torneio continental de seleções — um arquivo histórico completo de resultados e classificação.",
          startDate: new Date("2024-06-14"),
          endDate: new Date("2024-07-14"),
          logoUrl: null,
        },
      ])
      .returning();

    const worldCup = ensure(insertedEvents[0]);
    const confederations = ensure(insertedEvents[1]);
    const champions = ensure(insertedEvents[2]);
    const continental = ensure(insertedEvents[3]);

    // 4. Sedes/Estádios (espalhados pelo Brasil, com coordenadas reais para o mapa)
    console.log("🏟️ Inserindo estádios...");
    const insertedStadiums = await db
      .insert(stadiums)
      .values([
        {
          name: "Nogueirão",
          city: "Mossoró",
          capacity: 45000,
          latitude: -5.18,
          longitude: -37.34,
        },
        {
          name: "Maracanã",
          city: "Rio de Janeiro",
          capacity: 78000,
          latitude: -22.91,
          longitude: -43.23,
        },
        {
          name: "Neo Química Arena",
          city: "São Paulo",
          capacity: 49000,
          latitude: -23.54,
          longitude: -46.47,
        },
        {
          name: "Mineirão",
          city: "Belo Horizonte",
          capacity: 62000,
          latitude: -19.86,
          longitude: -43.97,
        },
        {
          name: "Arena Fonte Nova",
          city: "Salvador",
          capacity: 50000,
          latitude: -12.98,
          longitude: -38.5,
        },
        {
          name: "Beira-Rio",
          city: "Porto Alegre",
          capacity: 50000,
          latitude: -30.06,
          longitude: -51.24,
        },
        {
          name: "Arena Pernambuco",
          city: "Recife",
          capacity: 46000,
          latitude: -8.03,
          longitude: -35.01,
        },
        {
          name: "Estádio Mané Garrincha",
          city: "Brasília",
          capacity: 72000,
          latitude: -15.78,
          longitude: -47.9,
        },
        {
          name: "Arena Castelão",
          city: "Fortaleza",
          capacity: 63000,
          latitude: -3.81,
          longitude: -38.52,
        },
        {
          name: "Arena da Amazônia",
          city: "Manaus",
          capacity: 44000,
          latitude: -3.08,
          longitude: -60.03,
        },
      ])
      .returning();

    // 5. Times (16 seleções)
    console.log("⚽ Inserindo times...");
    const insertedTeams = await db
      .insert(teams)
      .values([
        { name: "Brasil", flagUrl: "https://flagcdn.com/br.svg" },
        { name: "Argentina", flagUrl: "https://flagcdn.com/ar.svg" },
        { name: "França", flagUrl: "https://flagcdn.com/fr.svg" },
        { name: "Alemanha", flagUrl: "https://flagcdn.com/de.svg" },
        { name: "Japão", flagUrl: "https://flagcdn.com/jp.svg" },
        { name: "Marrocos", flagUrl: "https://flagcdn.com/ma.svg" },
        { name: "Espanha", flagUrl: "https://flagcdn.com/es.svg" },
        { name: "Portugal", flagUrl: "https://flagcdn.com/pt.svg" },
        { name: "Inglaterra", flagUrl: "https://flagcdn.com/gb-eng.svg" },
        { name: "Itália", flagUrl: "https://flagcdn.com/it.svg" },
        { name: "Países Baixos", flagUrl: "https://flagcdn.com/nl.svg" },
        { name: "Croácia", flagUrl: "https://flagcdn.com/hr.svg" },
        { name: "Uruguai", flagUrl: "https://flagcdn.com/uy.svg" },
        { name: "México", flagUrl: "https://flagcdn.com/mx.svg" },
        { name: "Bélgica", flagUrl: "https://flagcdn.com/be.svg" },
        { name: "Senegal", flagUrl: "https://flagcdn.com/sn.svg" },
      ])
      .returning();

    // Atalhos por índice para legibilidade
    const team = (i: number) => ensure(insertedTeams[i]).id;
    const stadium = (i: number) => ensure(insertedStadiums[i]).id;

    // 6. Vincular times e sedes aos eventos (tabelas de junção N:N)
    console.log("🔗 Vinculando times e sedes aos eventos...");
    const linkTeams = (eventId: number, idxs: number[]) =>
      db.insert(eventTeams).values(idxs.map((i) => ({ eventId, teamId: team(i) })));
    const linkStadiums = (eventId: number, idxs: number[]) =>
      db.insert(eventStadiums).values(idxs.map((i) => ({ eventId, stadiumId: stadium(i) })));

    // Copa do Mundo: todos os 16 times e todas as 10 sedes
    await linkTeams(worldCup.id, [...Array(16).keys()]);
    await linkStadiums(worldCup.id, [...Array(10).keys()]);
    // Copa das Confederações: 8 seleções e 4 sedes
    await linkTeams(confederations.id, [0, 1, 2, 3, 6, 7, 8, 9]);
    await linkStadiums(confederations.id, [0, 1, 2, 3]);
    // Liga dos Campeões: 8 times e 5 sedes
    await linkTeams(champions.id, [0, 2, 4, 6, 8, 10, 12, 14]);
    await linkStadiums(champions.id, [1, 2, 3, 4, 5]);
    // Copa Continental 2024: 8 seleções e 4 sedes
    await linkTeams(continental.id, [0, 1, 2, 3, 4, 5, 6, 7]);
    await linkStadiums(continental.id, [4, 5, 6, 7]);

    // 7. Partidas — helper para legibilidade
    console.log("📅 Inserindo partidas...");
    type MatchSeed = {
      eventId: number;
      home: number;
      away: number;
      stadium: number;
      date: string;
      status: MatchStatus;
      homeScore?: number;
      awayScore?: number;
    };
    const m = (
      eventId: number,
      home: number,
      away: number,
      stadiumIdx: number,
      date: string,
      status: MatchStatus,
      homeScore?: number,
      awayScore?: number,
    ): MatchSeed => ({
      eventId,
      home,
      away,
      stadium: stadiumIdx,
      date,
      status,
      homeScore,
      awayScore,
    });

    const matchSeeds: MatchSeed[] = [
      // ── Copa do Mundo 2026 (em andamento — hoje é 11/06/2026) ──
      // Rodada 1 já encerrada
      m(worldCup.id, 0, 4, 1, "2026-06-11T16:00:00Z", "encerrado", 3, 1),
      m(worldCup.id, 2, 5, 2, "2026-06-11T19:00:00Z", "encerrado", 2, 2),
      m(worldCup.id, 6, 7, 3, "2026-06-11T22:00:00Z", "encerrado", 1, 0),
      m(worldCup.id, 8, 9, 7, "2026-06-12T16:00:00Z", "encerrado", 2, 1),
      // Acontecendo agora
      m(worldCup.id, 1, 12, 5, "2026-06-12T19:00:00Z", "em_andamento", 1, 1),
      m(worldCup.id, 3, 10, 0, "2026-06-12T19:00:00Z", "em_andamento", 0, 0),
      // Próximas (agendadas)
      m(worldCup.id, 0, 1, 1, "2026-06-13T16:00:00Z", "agendado"),
      m(worldCup.id, 2, 3, 2, "2026-06-13T19:00:00Z", "agendado"),
      m(worldCup.id, 4, 5, 0, "2026-06-14T18:00:00Z", "agendado"),
      m(worldCup.id, 6, 7, 3, "2026-06-15T20:00:00Z", "agendado"),
      m(worldCup.id, 8, 11, 9, "2026-06-16T18:00:00Z", "agendado"),
      m(worldCup.id, 13, 14, 8, "2026-06-16T21:00:00Z", "agendado"),
      m(worldCup.id, 15, 12, 6, "2026-06-17T18:00:00Z", "agendado"),
      m(worldCup.id, 10, 9, 4, "2026-06-17T21:00:00Z", "agendado"),

      // ── Copa das Confederações 2025 (encerrada) ──
      m(confederations.id, 0, 2, 1, "2025-08-02T16:00:00Z", "encerrado", 2, 1),
      m(confederations.id, 1, 3, 0, "2025-08-03T18:00:00Z", "encerrado", 0, 0),
      m(confederations.id, 6, 8, 2, "2025-08-04T16:00:00Z", "encerrado", 3, 2),
      m(confederations.id, 7, 9, 3, "2025-08-05T18:00:00Z", "encerrado", 1, 1),
      m(confederations.id, 0, 6, 1, "2025-08-09T16:00:00Z", "encerrado", 2, 0),
      m(confederations.id, 1, 8, 2, "2025-08-10T18:00:00Z", "encerrado", 1, 3),
      m(confederations.id, 0, 8, 1, "2025-08-17T16:00:00Z", "encerrado", 2, 1),

      // ── Liga dos Campeões 2025/26 (mata-mata, ida e volta) ──
      m(champions.id, 0, 2, 1, "2025-09-16T19:00:00Z", "encerrado", 2, 1),
      m(champions.id, 4, 6, 2, "2025-09-16T21:00:00Z", "encerrado", 0, 0),
      m(champions.id, 8, 10, 3, "2025-09-17T19:00:00Z", "encerrado", 3, 1),
      m(champions.id, 12, 14, 4, "2025-09-17T21:00:00Z", "encerrado", 1, 2),
      m(champions.id, 2, 0, 2, "2025-09-30T19:00:00Z", "encerrado", 1, 1),
      m(champions.id, 6, 4, 4, "2025-09-30T21:00:00Z", "encerrado", 2, 0),
      m(champions.id, 0, 6, 1, "2026-04-21T19:00:00Z", "agendado"),
      m(champions.id, 8, 14, 3, "2026-04-22T19:00:00Z", "agendado"),

      // ── Copa Continental 2024 (histórico, tudo encerrado) ──
      m(continental.id, 0, 1, 4, "2024-06-14T16:00:00Z", "encerrado", 1, 0),
      m(continental.id, 2, 3, 5, "2024-06-15T18:00:00Z", "encerrado", 2, 2),
      m(continental.id, 4, 5, 6, "2024-06-16T16:00:00Z", "encerrado", 0, 1),
      m(continental.id, 6, 7, 7, "2024-06-17T18:00:00Z", "encerrado", 3, 0),
      m(continental.id, 0, 2, 4, "2024-06-25T16:00:00Z", "encerrado", 2, 1),
      m(continental.id, 5, 6, 6, "2024-06-26T18:00:00Z", "encerrado", 1, 1),
      m(continental.id, 0, 6, 4, "2024-07-14T16:00:00Z", "encerrado", 2, 0),
    ];

    await db.insert(matches).values(
      matchSeeds.map((s) => ({
        eventId: s.eventId,
        homeTeamId: team(s.home),
        awayTeamId: team(s.away),
        stadiumId: stadium(s.stadium),
        date: new Date(s.date),
        status: s.status,
        homeScore: s.homeScore ?? null,
        awayScore: s.awayScore ?? null,
      })),
    );

    // 8. Favoritos (usuários comuns acompanhando eventos)
    console.log("⭐ Inserindo favoritos...");
    const bruno = ensure(insertedUsers[1]);
    const carla = ensure(insertedUsers[2]);
    const diego = ensure(insertedUsers[3]);
    await db.insert(userFavorites).values([
      { userId: bruno.id, eventId: worldCup.id },
      { userId: bruno.id, eventId: champions.id },
      { userId: carla.id, eventId: worldCup.id },
      { userId: carla.id, eventId: confederations.id },
      { userId: diego.id, eventId: champions.id },
    ]);

    console.log("✅ Banco de dados populado com sucesso!");
    console.log(
      `   ${insertedUsers.length} usuários · ${insertedEvents.length} eventos · ${insertedTeams.length} times · ${insertedStadiums.length} sedes · ${matchSeeds.length} partidas`,
    );
  } catch (error) {
    console.error("❌ Erro durante o processo de seed:", error);
    process.exit(1);
  }
}

seed();
