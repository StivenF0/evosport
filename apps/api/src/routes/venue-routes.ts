import { Elysia } from 'elysia';
import { venueService } from '../services/venue-service';

export const venueRoutes = new Elysia({ prefix: '/venues' })
  // CREATE
  .post('/', async ({ body }) => {
    try {
      return await venueService.createVenue(body as any);
    } catch {
      throw new Error('Erro ao criar a sede.');
    }
  })
  // READ (All)
  .get('/', async () => {
    try {
      return await venueService.getAllVenues();
    } catch {
      throw new Error('Erro ao buscar as sedes.');
    }
  })
  // READ (One)
  .get('/:id', async ({ params: { id } }) => {
    try {
      return await venueService.getVenueById(Number(id));
    } catch {
      throw new Error('Erro ao buscar a sede específica.');
    }
  })
  // UPDATE
  .put('/:id', async ({ params: { id }, body }) => {
    try {
      return await venueService.updateVenue(Number(id), body as any);
    } catch {
      throw new Error('Erro ao atualizar a sede.');
    }
  })
  // DELETE
  .delete('/:id', async ({ params: { id } }) => {
    try {
      return await venueService.deleteVenue(Number(id));
    } catch {
      throw new Error('Erro ao excluir a sede.');
    }
  });
