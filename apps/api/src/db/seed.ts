import { db } from './index';
import { event, teams, stadiums, matches } from './schema';

async function seed() {
  console.log('🌱 Iniciando o processo de seed...');

  try {
    // 1. Limpeza do banco de dados (evita duplicatas ao re-executar)
    console.log('🧹 Limpando dados antigos...');
    await db.delete(matches);
    await db.delete(stadiums);
    await db.delete(teams);
    await db.delete(event);

    // 2. Inserir Evento
    console.log('🏆 Inserindo evento...');
    const [insertedEvent] = await db.insert(event).values({
      name: 'Copa do Mundo Evosport 2026',
      startDate: new Date('2026-06-11'),
      endDate: new Date('2026-07-19'),
      logoUrl: 'https://example.com/logo-worldcup.png'
    }).returning();

    // 3. Inserir Sedes/Estádios
    console.log('🏟️ Inserindo estádios...');
    const insertedStadiums = await db.insert(stadiums).values([
      { name: 'Arena Dunnas', city: 'Mossoró', capacity: 45000, latitude: -5.18, longitude: -37.34 },
      { name: 'Maracanã', city: 'Rio de Janeiro', capacity: 78000, latitude: -22.91, longitude: -43.23 },
      { name: 'Neo Química Arena', city: 'São Paulo', capacity: 49000, latitude: -23.54, longitude: -46.47 },
      { name: 'Mineirão', city: 'Belo Horizonte', capacity: 62000, latitude: -19.86, longitude: -43.97 }
    ]).returning();

    // 4. Inserir Times
    console.log('⚽ Inserindo times...');
    const insertedTeams = await db.insert(teams).values([
      { name: 'Brasil', flagUrl: 'https://flagsapi.com/BR/flat/64.png' },
      { name: 'Argentina', flagUrl: 'https://flagsapi.com/AR/flat/64.png' },
      { name: 'França', flagUrl: 'https://flagsapi.com/FR/flat/64.png' },
      { name: 'Alemanha', flagUrl: 'https://flagsapi.com/DE/flat/64.png' },
      { name: 'Japão', flagUrl: 'https://flagsapi.com/JP/flat/64.png' },
      { name: 'Marrocos', flagUrl: 'https://flagsapi.com/MA/flat/64.png' },
      { name: 'Espanha', flagUrl: 'https://flagsapi.com/ES/flat/64.png' },
      { name: 'Portugal', flagUrl: 'https://flagsapi.com/PT/flat/64.png' }
    ]).returning();

    // 5. Inserir Partidas Iniciais
    console.log('📅 Inserindo partidas...');
    await db.insert(matches).values([
      {
        homeTeamId: insertedTeams[0]!.id, // Brasil
        awayTeamId: insertedTeams[1]!.id, // Argentina
        stadiumId: insertedStadiums[1]!.id, // Maracanã
        date: new Date('2026-06-12T16:00:00Z'),
        status: 'agendado'
      },
      {
        homeTeamId: insertedTeams[2]!.id, // França
        awayTeamId: insertedTeams[3]!.id, // Alemanha
        stadiumId: insertedStadiums[2]!.id, // Neo Química
        date: new Date('2026-06-13T14:00:00Z'),
        status: 'agendado'
      },
      {
        homeTeamId: insertedTeams[4]!.id, // Japão
        awayTeamId: insertedTeams[5]!.id, // Marrocos
        stadiumId: insertedStadiums[0]!.id, // Arena Dunnas
        date: new Date('2026-06-14T18:00:00Z'),
        status: 'agendado'
      },
      {
        homeTeamId: insertedTeams[6]!.id, // Espanha
        awayTeamId: insertedTeams[7]!.id, // Portugal
        stadiumId: insertedStadiums[3]!.id, // Mineirão
        date: new Date('2026-06-15T20:00:00Z'),
        status: 'agendado'
      }
    ]);

    console.log('✅ Banco de dados populado com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o processo de seed:', error);
    process.exit(1);
  }
}

seed();
