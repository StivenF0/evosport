import { Elysia } from 'elysia';
import { matchService } from '../services/match-service';

export const matchRoutes = new Elysia({ prefix: '/match' })
  // CREATE
  .post('/', async ({ body }) => {
    try {
      return await matchService.createMatch(body as any);
    } catch {
      throw new Error('Erro ao criar a partida.');
    }
  })
  // READ (All - UC02 e UC03 listagem com datas formatadas)
  .get('/', async () => {
    try {
      return await matchService.getAllMatches();
    } catch {
      throw new Error('Erro ao buscar as partidas.');
    }
  })
  // READ (Grouped by Date - Extra para facilitar a UI)
  .get('/grouped-by-date', async () => {
    try {
      return await matchService.getMatchesGroupedByDate();
    } catch {
      throw new Error('Erro ao agrupar as partidas por data.');
    }
  })
  // READ (One)
  .get('/:id', async ({ params: { id } }) => {
    try {
      return await matchService.getMatchById(Number(id));
    } catch {
      throw new Error('Erro ao buscar a partida específica.');
    }
  })
  // UPDATE
  .put('/:id', async ({ params: { id }, body }) => {
    try {
      return await matchService.updateMatch(Number(id), body as any);
    } catch {
      throw new Error('Erro ao atualizar a partida.');
    }
  })
  // DELETE
  .delete('/:id', async ({ params: { id } }) => {
    try {
      return await matchService.deleteMatch(Number(id));
    } catch {
      throw new Error('Erro ao excluir a partida.');
    }
  });
