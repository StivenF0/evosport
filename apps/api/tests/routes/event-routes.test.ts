import { describe, expect, it, beforeEach, afterEach, spyOn, mock } from 'bun:test';
import { Elysia } from 'elysia';
import { matchRoutes } from '@api/routes/match-routes';
import { matchService } from '@api/services/match-service';

// 1. Instância limpa do app contendo apenas as rotas de partida
const app = new Elysia().use(matchRoutes);

// 2. Helper eficiente para disparar requisições sem repetir 'http://localhost'
const req = (path: string, options?: RequestInit) =>
  app.handle(new Request(`http://localhost/match${path}`, options));

describe('MatchRoutes - Integração', () => {
  afterEach(() => {
      mock.restore();
  });
  beforeEach(() => {
    spyOn(matchService, 'createMatch').mockRestore();
    spyOn(matchService, 'getAllMatches').mockRestore();
    spyOn(matchService, 'getMatchesGroupedByDate').mockRestore();
    spyOn(matchService, 'getMatchById').mockRestore();
    spyOn(matchService, 'updateMatch').mockRestore();
    spyOn(matchService, 'deleteMatch').mockRestore();
  });

  // Mocks completos para satisfazer a validação de Schema do Elysia (Evita Erro 422)
  const validHomeTeam = { id: 1, name: 'Brasil', flagUrl: null };
  const validAwayTeam = { id: 2, name: 'Argentina', flagUrl: null };
  const validStadium = { id: 1, name: 'Maracanã', city: 'Rio de Janeiro', capacity: 78000, latitude: null, longitude: null };
  const validDate = new Date('2026-06-15T00:00:00.000Z');

  it('POST / - should create a match and return 200', async () => {
    spyOn(matchService, 'createMatch').mockResolvedValue({
      id: 1, homeTeamId: 1, awayTeamId: 2, stadiumId: 1, date: validDate, status: 'agendado'
    });

    const res = await req('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ homeTeamId: 1, awayTeamId: 2, stadiumId: 1, date: '2026-06-15T00:00:00.000Z' })
    });

    expect(res.status).toBe(200);
    const json: any = await res.json();
    expect(json.id).toBe(1);
  });

  it('GET / - should return all formatted matches', async () => {
    spyOn(matchService, 'getAllMatches').mockResolvedValue([
      {
        id: 1, homeTeamId: 1, awayTeamId: 2, stadiumId: 1, date: validDate, status: 'agendado', formattedDate: '15/06/2026',
        homeTeam: validHomeTeam, awayTeam: validAwayTeam, stadium: validStadium
      }
    ]);

    const res = await req('/');

    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data).toBeArrayOfSize(1);
    expect(data[0].formattedDate).toBe('15/06/2026');
  });

  it('GET /grouped-by-date - should return matches grouped', async () => {
    spyOn(matchService, 'getMatchesGroupedByDate').mockResolvedValue({
      '15/06/2026': [
        {
          id: 1, homeTeamId: 1, awayTeamId: 2, stadiumId: 1, date: validDate, status: 'agendado', formattedDate: '15/06/2026',
          homeTeam: validHomeTeam, awayTeam: validAwayTeam, stadium: validStadium
        }
      ]
    });

    const res = await req('/grouped-by-date');
    const data: any = await res.json();

    expect(res.status).toBe(200);
    expect(data['15/06/2026']).toBeDefined();
  });

  it('GET /:id - should return specific match', async () => {
    spyOn(matchService, 'getMatchById').mockResolvedValue({
      id: 1, homeTeamId: 1, awayTeamId: 2, stadiumId: 1, date: validDate, status: 'agendado', formattedDate: '15/06/2026',
      homeTeam: validHomeTeam, awayTeam: validAwayTeam, stadium: validStadium
    });

    const res = await req('/1');
    expect(res.status).toBe(200);
    const json: any = await res.json();
    expect(json.id).toBe(1);
  });

  it('PUT /:id - should update match', async () => {
    spyOn(matchService, 'updateMatch').mockResolvedValue({
      id: 1, homeTeamId: 1, awayTeamId: 2, stadiumId: 1, date: validDate, status: 'em_andamento'
    });

    const res = await req('/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ homeTeamId: 1, awayTeamId: 2, stadiumId: 1, date: '2026-06-15T00:00:00.000Z', status: 'em_andamento' })
    });

    expect(res.status).toBe(200);
    const json: any = await res.json();
    expect(json.status).toBe('em_andamento');
  });

  it('DELETE /:id - should delete match', async () => {
    spyOn(matchService, 'deleteMatch').mockResolvedValue({
      id: 1, homeTeamId: 1, awayTeamId: 2, stadiumId: 1, date: validDate, status: 'agendado'
    });

    const res = await req('/1', { method: 'DELETE' });
    expect(res.status).toBe(200);
    const json: any = await res.json();
    expect(json.id).toBe(1);
  });

  it('should return 500 on internal service error', async () => {
    spyOn(matchService, 'getAllMatches').mockRejectedValue(new Error('Erro interno'));

    const res = await req('/');
    expect(res.status).toBe(500);
  });
});
