import { Elysia } from 'elysia';
import { venueService } from '../services/venue-service';
import { IdParam, ErrorResponse } from '../schemas/shared-schemas';
import { VenueBody, VenueResponse, VenueListResponse } from '../schemas/venue-schemas';

export const venueRoutes = new Elysia({ prefix: '/venue' })
  // CREATE
  .post('/', async ({ body }) => {
    try {
      return await venueService.createVenue(body);
    } catch {
      throw new Error('Erro ao criar a sede.');
    }
  }, {
    body: VenueBody,
    response: {
      200: VenueResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Criar uma nova sede/estádio',
      tags: ['Venues']
    }
  })
  // READ (All)
  .get('/', async () => {
    try {
      return await venueService.getAllVenues();
    } catch {
      throw new Error('Erro ao buscar as sedes.');
    }
  }, {
    response: {
      200: VenueListResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Listar todas as sedes',
      tags: ['Venues']
    }
  })
  // READ (One)
  .get('/:id', async ({ params: { id } }) => {
    try {
      return await venueService.getVenueById(id);
    } catch {
      throw new Error('Erro ao buscar a sede específica.');
    }
  }, {
    params: IdParam,
    response: {
      200: VenueResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Buscar sede por ID',
      tags: ['Venues']
    }
  })
  // UPDATE
  .put('/:id', async ({ params: { id }, body }) => {
    try {
      return await venueService.updateVenue(id, body);
    } catch {
      throw new Error('Erro ao atualizar a sede.');
    }
  }, {
    params: IdParam,
    body: VenueBody,
    response: {
      200: VenueResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Atualizar sede',
      tags: ['Venues']
    }
  })
  // DELETE
  .delete('/:id', async ({ params: { id } }) => {
    try {
      return await venueService.deleteVenue(id);
    } catch {
      throw new Error('Erro ao excluir a sede.');
    }
  }, {
    params: IdParam,
    response: {
      200: VenueResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Excluir sede',
      tags: ['Venues']
    }
  });
