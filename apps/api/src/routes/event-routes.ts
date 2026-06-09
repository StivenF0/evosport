import { Elysia } from "elysia";
import { EventBody, EventResponse } from "../schemas/event-schemas";
import { ErrorResponse, IdParam } from "../schemas/shared-schemas";
import { eventService } from "../services/event-service";

export const eventRoutes = new Elysia({ prefix: "/event" })
  // CREATE
  .post(
    "/",
    async ({ body }) => {
      try {
        return await eventService.createEvent(body);
      } catch {
        throw new Error("Erro ao criar o evento.");
      }
    },
    {
      body: EventBody,
      response: {
        200: EventResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Criar um novo evento",
        tags: ["Events"],
      },
    },
  )
  // READ (UC01 - Busca o primeiro evento ou por ID)
  .get(
    "/",
    async () => {
      try {
        const events = await eventService.getAllEvents();
        const [firstEvent] = events;

        if (!firstEvent) {
          throw new Error("Nenhum evento encontrado.");
        }

        return firstEvent;
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error("Erro ao buscar o evento.");
      }
    },
    {
      response: {
        200: EventResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Buscar evento principal",
        description: "Retorna o primeiro evento cadastrado no sistema (UC01).",
        tags: ["Events"],
      },
    },
  )
  // READ (Specific ID)
  .get(
    "/:id",
    async ({ params: { id } }) => {
      try {
        return await eventService.getEventById(id);
      } catch {
        throw new Error("Erro ao buscar o evento específico.");
      }
    },
    {
      params: IdParam,
      response: {
        200: EventResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Buscar evento por ID",
        tags: ["Events"],
      },
    },
  )
  // UPDATE
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      try {
        return await eventService.updateEvent(id, body);
      } catch {
        throw new Error("Erro ao atualizar o evento.");
      }
    },
    {
      params: IdParam,
      body: EventBody,
      response: {
        200: EventResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Atualizar evento",
        tags: ["Events"],
      },
    },
  )
  // DELETE
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      try {
        return await eventService.deleteEvent(id);
      } catch {
        throw new Error("Erro ao excluir o evento.");
      }
    },
    {
      params: IdParam,
      response: {
        200: EventResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Excluir evento",
        tags: ["Events"],
      },
    },
  );
