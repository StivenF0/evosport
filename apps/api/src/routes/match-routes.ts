import { Elysia } from 'elysia';
import { matchService } from '../services/match-service';
import { IdParam, ErrorResponse } from '../schemas/shared-schemas';
import {
  MatchBody,
  MatchBaseResponse,
  MatchWithRelationsResponse,
  MatchListResponse,
  MatchGroupedByDateResponse
} from '../schemas/match-schemas';

export const matchRoutes = new Elysia({ prefix: '/match' })
  // CREATE
  .post('/', async ({ body }) => {
    try {
      return await matchService.createMatch(body);
    } catch {
      throw new Error('Erro ao criar a partida.');
    }
  }, {
    body: MatchBody,
    response: {
      200: MatchBaseResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Criar uma nova partida',
      tags: ['Matches']
    }
  })
  // READ (All - UC02 e UC03 listagem com datas formatadas)
  .get('/', async () => {
    try {
      return await matchService.getAllMatches();
    } catch {
      throw new Error('Erro ao buscar as partidas.');
    }
  }, {
    response: {
      200: MatchListResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Listar todas as partidas',
      description: 'Retorna a listagem de partidas com datas formatadas em pt-BR (UC02, UC03).',
      tags: ['Matches']
    }
  })
  // READ (Grouped by Date - Extra para facilitar a UI)
  .get('/grouped-by-date', async () => {
    try {
      return await matchService.getMatchesGroupedByDate();
    } catch {
      throw new Error('Erro ao agrupar as partidas por data.');
    }
  }, {
    response: {
      200: MatchGroupedByDateResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Listar partidas agrupadas por data',
      tags: ['Matches']
    }
  })
  // READ (One)
  .get('/:id', async ({ params: { id } }) => {
    try {
      return await matchService.getMatchById(id);
    } catch {
      throw new Error('Erro ao buscar a partida específica.');
    }
  }, {
    params: IdParam,
    response: {
      200: MatchWithRelationsResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Buscar partida por ID',
      tags: ['Matches']
    }
  })
  // UPDATE
  .put('/:id', async ({ params: { id }, body }) => {
    try {
      return await matchService.updateMatch(id, body);
    } catch {
      throw new Error('Erro ao atualizar a partida.');
    }
  }, {
    params: IdParam,
    body: MatchBody,
    response: {
      200: MatchBaseResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Atualizar partida',
      tags: ['Matches']
    }
  })
  // DELETE
  .delete('/:id', async ({ params: { id } }) => {
    try {
      return await matchService.deleteMatch(id);
    } catch {
      throw new Error('Erro ao excluir a partida.');
    }
  }, {
    params: IdParam,
    response: {
      200: MatchBaseResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Excluir partida',
      tags: ['Matches']
    }
  });
