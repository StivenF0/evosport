import { describe, expect, it, beforeEach, spyOn } from 'bun:test';
import { matchRepository } from '@api/repositories/match-repository';
import { db } from '@api/db';

describe('MatchRepository - Create Match', () => {
  beforeEach(() => {
    spyOn(db, 'insert').mockRestore();
  });

  it('should create a new match.', async () => {
    // Mock da chain: db.insert().values().returning()
    spyOn(db, 'insert').mockReturnValue({
      values: () => ({
        returning: () => Promise.resolve([{ id: 1, homeTeamId: 1, awayTeamId: 2, status: 'agendado' }])
      })
    } as any);

    const match = await matchRepository.create({
      homeTeamId: 1,
      awayTeamId: 2,
      stadiumId: 1,
      date: new Date('2026-06-15')
    });

    expect(match).not.toBeNull();
    expect(match?.id).toBe(1);
    expect(match?.status).toBe('agendado');
  });

  it('should throw an error if match failed to be created.', async () => {
    spyOn(db, 'insert').mockReturnValue({
      values: () => ({
        returning: () => Promise.resolve([]) // Array vazio simula a falha no Drizzle
      })
    } as any);

    const match = matchRepository.create({
      homeTeamId: 1, awayTeamId: 2, stadiumId: 1, date: new Date()
    });

    expect(match).rejects.toThrow('Falha ao criar a partida.');
  });
});

describe('MatchRepository - Get All With Teams', () => {
  beforeEach(() => {
    // Configura o objeto db.query caso não exista no ambiente de teste isolado
    if (!db.query) db.query = { matches: {} } as any;
    spyOn(db.query.matches as any, 'findMany').mockRestore();
  });

  it('should return all matches with their relations.', async () => {
    spyOn(db.query.matches as any, 'findMany').mockResolvedValue([
      { id: 1, homeTeam: { name: 'Brasil' }, awayTeam: { name: 'Argentina' }, stadium: { name: 'Maracanã' } }
    ]);

    const matches = await matchRepository.getAllWithTeams();

    expect(matches).toBeArrayOfSize(1);
    expect((matches[0] as any)?.homeTeam?.name).toBe('Brasil');
  });

  it('should throw an error if the query fails.', async () => {
    spyOn(db.query.matches as any, 'findMany').mockRejectedValue(new Error());

    const matches = matchRepository.getAllWithTeams();

    expect(matches).rejects.toThrow('Erro ao buscar as partidas e os times.');
  });
});

describe('MatchRepository - Find By Id', () => {
  beforeEach(() => {
    if (!db.query) db.query = { matches: {} } as any;
    spyOn(db.query.matches as any, 'findFirst').mockRestore();
  });

  it('should return a match by ID.', async () => {
    spyOn(db.query.matches as any, 'findFirst').mockResolvedValue({
      id: 1, status: 'encerrado'
    });

    const match = await matchRepository.findById(1);

    expect(match).not.toBeNull();
    expect(match?.id).toBe(1);
  });

  it('should throw an error if no match was found by ID.', async () => {
    spyOn(db.query.matches as any, 'findFirst').mockResolvedValue(undefined);

    const match = matchRepository.findById(99);

    expect(match).rejects.toThrow('Partida não encontrada.');
  });
});

describe('MatchRepository - Update Match', () => {
  beforeEach(() => {
    spyOn(db, 'update').mockRestore();
  });

  it('should update a match.', async () => {
    // Mock da chain: db.update().set().where().returning()
    spyOn(db, 'update').mockReturnValue({
      set: () => ({
        where: () => ({
          returning: () => Promise.resolve([{ id: 1, status: 'em_andamento' }])
        })
      })
    } as any);

    const match = await matchRepository.update(1, { status: 'em_andamento' });

    expect(match).not.toBeNull();
    expect(match?.status).toBe('em_andamento');
  });

  it('should throw an error if match is not found for update.', async () => {
    spyOn(db, 'update').mockReturnValue({
      set: () => ({
        where: () => ({
          returning: () => Promise.resolve([])
        })
      })
    } as any);

    const match = matchRepository.update(99, { status: 'encerrado' });

    expect(match).rejects.toThrow('Partida não encontrada para atualização.');
  });
});

describe('MatchRepository - Delete Match', () => {
  beforeEach(() => {
    spyOn(db, 'delete').mockRestore();
  });

  it('should delete a match.', async () => {
    // Mock da chain: db.delete().where().returning()
    spyOn(db, 'delete').mockReturnValue({
      where: () => ({
        returning: () => Promise.resolve([{ id: 1, status: 'agendado' }])
      })
    } as any);

    const match = await matchRepository.delete(1);

    expect(match).not.toBeNull();
    expect(match?.id).toBe(1);
  });

  it('should throw an error if match is not found for delete.', async () => {
    spyOn(db, 'delete').mockReturnValue({
      where: () => ({
        returning: () => Promise.resolve([])
      })
    } as any);

    const match = matchRepository.delete(99);

    expect(match).rejects.toThrow('Partida não encontrada para exclusão.');
  });
});
