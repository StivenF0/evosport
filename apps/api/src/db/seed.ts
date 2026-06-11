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

    // Inserir usuário administrador inicial
    console.log("👤 Inserindo usuário admin...");
    await db.insert(users).values({
      name: "Administrador",
      email: "admin@evosport.com",
      passwordHash: await Bun.password.hash("admin123"),
      role: "admin",
    });

    // 2. Inserir Eventos globais
    console.log("🏆 Inserindo eventos...");
    const insertedEvents = await db
      .insert(event)
      .values([
        {
          name: "Copa do Mundo Evosport 2026",
          description:
            "O principal torneio global de seleções, reunindo as melhores equipes do mundo em uma disputa eliminatória.",
          startDate: new Date("2026-06-11"),
          endDate: new Date("2026-07-19"),
          logoUrl: "https://i.pinimg.com/736x/63/90/04/63900492a4c38c5b89321260e13c4eda.jpg",
        },
        {
          name: "Copa das Confederações Evosport 2025",
          description:
            "Torneio internacional que reúne os campeões continentais em um confronto de alto nível.",
          startDate: new Date("2025-08-01"),
          endDate: new Date("2025-08-20"),
          logoUrl: null,
        },
      ])
      .returning();

    const worldCup = ensure(insertedEvents[0]);
    const confederations = ensure(insertedEvents[1]);

    // 3. Inserir Sedes/Estádios
    console.log("🏟️ Inserindo estádios...");
    const insertedStadiums = await db
      .insert(stadiums)
      .values([
        {
          name: "Arena Dunnas",
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
      ])
      .returning();

    // 4. Inserir Times
    console.log("⚽ Inserindo times...");
    const insertedTeams = await db
      .insert(teams)
      .values([
        { name: "Brasil", flagUrl: "https://flagfeed.com/country/br" },
        { name: "Argentina", flagUrl: "https://flagfeed.com/country/ar" },
        { name: "França", flagUrl: "https://flagfeed.com/country/fr" },
        { name: "Alemanha", flagUrl: "https://flagfeed.com/country/de" },
        { name: "Japão", flagUrl: "https://flagfeed.com/country/jp" },
        { name: "Marrocos", flagUrl: "https://flagfeed.com/country/ma" },
        { name: "Espanha", flagUrl: "https://flagfeed.com/country/es" },
        { name: "Portugal", flagUrl: "https://flagfeed.com/country/pt" },
      ])
      .returning();

    // 5. Vincular times e sedes aos eventos (tabelas de junção N:N)
    console.log("🔗 Vinculando times e sedes aos eventos...");
    // Copa do Mundo: todos os 8 times e as 4 sedes
    await db
      .insert(eventTeams)
      .values(insertedTeams.map((team) => ({ eventId: worldCup.id, teamId: team.id })));
    await db
      .insert(eventStadiums)
      .values(insertedStadiums.map((stadium) => ({ eventId: worldCup.id, stadiumId: stadium.id })));
    // Copa das Confederações: os 4 primeiros times (compartilhados) e 2 sedes
    await db
      .insert(eventTeams)
      .values(
        insertedTeams.slice(0, 4).map((team) => ({ eventId: confederations.id, teamId: team.id })),
      );
    await db.insert(eventStadiums).values(
      insertedStadiums.slice(0, 2).map((stadium) => ({
        eventId: confederations.id,
        stadiumId: stadium.id,
      })),
    );

    // 6. Inserir Partidas
    console.log("📅 Inserindo partidas...");
    await db.insert(matches).values([
      // Copa do Mundo 2026
      {
        eventId: worldCup.id,
        homeTeamId: ensure(insertedTeams[0]).id, // Brasil
        awayTeamId: ensure(insertedTeams[1]).id, // Argentina
        stadiumId: ensure(insertedStadiums[1]).id, // Maracanã
        date: new Date("2026-06-12T16:00:00Z"),
        status: "agendado",
      },
      {
        eventId: worldCup.id,
        homeTeamId: ensure(insertedTeams[2]).id, // França
        awayTeamId: ensure(insertedTeams[3]).id, // Alemanha
        stadiumId: ensure(insertedStadiums[2]).id, // Neo Química
        date: new Date("2026-06-13T14:00:00Z"),
        status: "agendado",
      },
      {
        eventId: worldCup.id,
        homeTeamId: ensure(insertedTeams[4]).id, // Japão
        awayTeamId: ensure(insertedTeams[5]).id, // Marrocos
        stadiumId: ensure(insertedStadiums[0]).id, // Arena Dunnas
        date: new Date("2026-06-14T18:00:00Z"),
        status: "agendado",
      },
      {
        eventId: worldCup.id,
        homeTeamId: ensure(insertedTeams[6]).id, // Espanha
        awayTeamId: ensure(insertedTeams[7]).id, // Portugal
        stadiumId: ensure(insertedStadiums[3]).id, // Mineirão
        date: new Date("2026-06-15T20:00:00Z"),
        status: "agendado",
      },
      // Copa das Confederações 2025 (já encerrada — alimenta a classificação)
      {
        eventId: confederations.id,
        homeTeamId: ensure(insertedTeams[0]).id, // Brasil
        awayTeamId: ensure(insertedTeams[2]).id, // França
        stadiumId: ensure(insertedStadiums[1]).id, // Maracanã
        date: new Date("2025-08-02T16:00:00Z"),
        status: "encerrado",
        homeScore: 2,
        awayScore: 1,
      },
      {
        eventId: confederations.id,
        homeTeamId: ensure(insertedTeams[1]).id, // Argentina
        awayTeamId: ensure(insertedTeams[3]).id, // Alemanha
        stadiumId: ensure(insertedStadiums[0]).id, // Arena Dunnas
        date: new Date("2025-08-03T18:00:00Z"),
        status: "encerrado",
        homeScore: 0,
        awayScore: 0,
      },
    ]);

    console.log("✅ Banco de dados populado com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante o processo de seed:", error);
    process.exit(1);
  }
}

seed();
