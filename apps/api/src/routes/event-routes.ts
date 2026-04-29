import { Elysia, t } from 'elysia';
import { eventService } from '../services/event-service';

export const eventRoutes = new Elysia({ prefix: '/event' })
  // CREATE
  .post('/', async ({ body }) => {
    try {
      return await eventService.createEvent(body as any);
    } catch {
      throw new Error('Erro ao criar o evento.');
    }
  })
  // READ (UC01 - Busca o primeiro evento ou por ID)
  .get('/', async () => {
    try {
      const events = await eventService.getAllEvents();
      if (!events.length) throw new Error('Nenhum evento encontrado.');
      return events[0];
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Erro ao buscar o evento.');
    }
  })
  // READ (Specific ID)
  .get('/:id', async ({ params: { id } }) => {
    try {
      return await eventService.getEventById(Number(id));
    } catch {
      throw new Error('Erro ao buscar o evento específico.');
    }
  })
  // UPDATE
  .put('/:id', async ({ params: { id }, body }) => {
    try {
      return await eventService.updateEvent(Number(id), body as any);
    } catch {
      throw new Error('Erro ao atualizar o evento.');
    }
  })
  // DELETE
  .delete('/:id', async ({ params: { id } }) => {
    try {
      return await eventService.deleteEvent(Number(id));
    } catch {
      throw new Error('Erro ao excluir o evento.');
    }
  });
