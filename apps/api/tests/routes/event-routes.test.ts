import { describe, expect, it, afterEach, spyOn, mock } from 'bun:test';
import { Elysia } from 'elysia';
import { eventRoutes } from '@api/routes/event-routes';
import { eventService } from '@api/services/event-service';

const app = new Elysia().use(eventRoutes);
const req = (p: string, o?: RequestInit) => app.handle(new Request(`http://localhost/event${p}`, o));

describe('EventRoutes', () => {
  afterEach(() => mock.restore());

  const validEvent = {
    id: 1, name: 'Copa Evosport',
    startDate: new Date('2026-06-11T00:00:00.000Z'),
    endDate: new Date('2026-07-19T00:00:00.000Z'),
    logoUrl: null
  };

  const bodyData = JSON.stringify({
    name: 'Copa Evosport', startDate: '2026-06-11T00:00:00.000Z', endDate: '2026-07-19T00:00:00.000Z'
  });

  it('POST /', async () => {
    spyOn(eventService, 'createEvent').mockResolvedValue(validEvent);
    const res = await req('/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: bodyData });
    expect(res.status).toBe(200);
  });

  it('GET /', async () => {
    // Retorna array porque o service de listar tudo retorna array, mas a rota pega o [0]
    spyOn(eventService, 'getAllEvents').mockResolvedValue([validEvent]);
    expect((await req('/')).status).toBe(200);
  });

  it('GET /:id', async () => {
    spyOn(eventService, 'getEventById').mockResolvedValue(validEvent);
    expect((await req('/1')).status).toBe(200);
  });

  it('PUT /:id', async () => {
    spyOn(eventService, 'updateEvent').mockResolvedValue(validEvent);
    const res = await req('/1', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: bodyData });
    expect(res.status).toBe(200);
  });

  it('DELETE /:id', async () => {
    spyOn(eventService, 'deleteEvent').mockResolvedValue(validEvent);
    expect((await req('/1', { method: 'DELETE' })).status).toBe(200);
  });
});
