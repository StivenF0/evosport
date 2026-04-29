import { Elysia } from 'elysia';
import { teamService } from '../services/team-service';

export const teamRoutes = new Elysia({ prefix: '/team' })
  // CREATE
  .post('/', async ({ body }) => {
    try {
      return await teamService.createTeam(body as any);
    } catch {
      throw new Error('Erro ao criar o time.');
    }
  })
  // READ (All - UC04 listagem de times)
  .get('/', async () => {
    try {
      return await teamService.getAllTeams();
    } catch {
      throw new Error('Erro ao buscar os times.');
    }
  })
  // READ (One)
  .get('/:id', async ({ params: { id } }) => {
    try {
      return await teamService.getTeamById(Number(id));
    } catch {
      throw new Error('Erro ao buscar o time específico.');
    }
  })
  // UPDATE
  .put('/:id', async ({ params: { id }, body }) => {
    try {
      return await teamService.updateTeam(Number(id), body as any);
    } catch {
      throw new Error('Erro ao atualizar o time.');
    }
  })
  // DELETE
  .delete('/:id', async ({ params: { id } }) => {
    try {
      return await teamService.deleteTeam(Number(id));
    } catch {
      throw new Error('Erro ao excluir o time.');
    }
  });
