import { Elysia } from 'elysia';
import { teamService } from '../services/team-service';
import { IdParam, ErrorResponse } from '../schemas/shared-schemas';
import { TeamBody, TeamResponse, TeamListResponse } from '../schemas/team-schemas';

export const teamRoutes = new Elysia({ prefix: '/team' })
  // CREATE
  .post('/', async ({ body }) => {
    try {
      return await teamService.createTeam(body);
    } catch {
      throw new Error('Erro ao criar o time.');
    }
  }, {
    body: TeamBody,
    response: {
      200: TeamResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Criar um novo time',
      tags: ['Teams']
    }
  })
  // READ (All - UC04 listagem de times)
  .get('/', async () => {
    try {
      return await teamService.getAllTeams();
    } catch {
      throw new Error('Erro ao buscar os times.');
    }
  }, {
    response: {
      200: TeamListResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Listar todos os times',
      description: 'Retorna a listagem de todos os times cadastrados (UC04).',
      tags: ['Teams']
    }
  })
  // READ (One)
  .get('/:id', async ({ params: { id } }) => {
    try {
      return await teamService.getTeamById(id);
    } catch {
      throw new Error('Erro ao buscar o time específico.');
    }
  }, {
    params: IdParam,
    response: {
      200: TeamResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Buscar time por ID',
      tags: ['Teams']
    }
  })
  // UPDATE
  .put('/:id', async ({ params: { id }, body }) => {
    try {
      return await teamService.updateTeam(id, body);
    } catch {
      throw new Error('Erro ao atualizar o time.');
    }
  }, {
    params: IdParam,
    body: TeamBody,
    response: {
      200: TeamResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Atualizar time',
      tags: ['Teams']
    }
  })
  // DELETE
  .delete('/:id', async ({ params: { id } }) => {
    try {
      return await teamService.deleteTeam(id);
    } catch {
      throw new Error('Erro ao excluir o time.');
    }
  }, {
    params: IdParam,
    response: {
      200: TeamResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Excluir time',
      tags: ['Teams']
    }
  });
