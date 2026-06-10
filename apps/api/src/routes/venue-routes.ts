import { Elysia } from "elysia";
import { authPlugin, requireAdmin } from "../plugins/auth";
import { ErrorResponse, IdParam } from "../schemas/shared-schemas";
import { VenueBody, VenueListResponse, VenueResponse } from "../schemas/venue-schemas";
import { venueService } from "../services/venue-service";

export const venueRoutes = new Elysia({ prefix: "/venue" })
  .use(authPlugin)
  // CREATE (admin)
  .post(
    "/",
    async ({ body }) => {
      try {
        return await venueService.createVenue(body);
      } catch {
        throw new Error("Erro ao criar a sede.");
      }
    },
    {
      beforeHandle: requireAdmin,
      body: VenueBody,
      response: {
        200: VenueResponse,
        401: ErrorResponse,
        403: ErrorResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Criar uma nova sede/estádio (admin)",
        tags: ["Venues"],
      },
    },
  )
  // READ (All)
  .get(
    "/",
    async () => {
      try {
        return await venueService.getAllVenues();
      } catch {
        throw new Error("Erro ao buscar as sedes.");
      }
    },
    {
      response: {
        200: VenueListResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Listar todas as sedes",
        tags: ["Venues"],
      },
    },
  )
  // READ (One)
  .get(
    "/:id",
    async ({ params: { id } }) => {
      try {
        return await venueService.getVenueById(id);
      } catch {
        throw new Error("Erro ao buscar a sede específica.");
      }
    },
    {
      params: IdParam,
      response: {
        200: VenueResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Buscar sede por ID",
        tags: ["Venues"],
      },
    },
  )
  // UPDATE
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      try {
        return await venueService.updateVenue(id, body);
      } catch {
        throw new Error("Erro ao atualizar a sede.");
      }
    },
    {
      beforeHandle: requireAdmin,
      params: IdParam,
      body: VenueBody,
      response: {
        200: VenueResponse,
        401: ErrorResponse,
        403: ErrorResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Atualizar sede (admin)",
        tags: ["Venues"],
      },
    },
  )
  // DELETE (admin)
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      try {
        return await venueService.deleteVenue(id);
      } catch {
        throw new Error("Erro ao excluir a sede.");
      }
    },
    {
      beforeHandle: requireAdmin,
      params: IdParam,
      response: {
        200: VenueResponse,
        401: ErrorResponse,
        403: ErrorResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Excluir sede (admin)",
        tags: ["Venues"],
      },
    },
  );
