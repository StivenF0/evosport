import { Elysia, t } from "elysia";
import { authPlugin, requireAdmin } from "../plugins/auth";
import { EventBody, EventListResponse, EventResponse } from "../schemas/event-schemas";
import { MatchListResponse, MatchWithRelationsResponse } from "../schemas/match-schemas";
import { RankingResponse } from "../schemas/ranking-schemas";
import { ErrorResponse, IdParam } from "../schemas/shared-schemas";
import { TeamListResponse } from "../schemas/team-schemas";
import { VenueListResponse } from "../schemas/venue-schemas";
import { eventService } from "../services/event-service";
import { matchService } from "../services/match-service";
import { rankingService } from "../services/ranking-service";

const LinkTeamParam = t.Object({
  id: t.Numeric({ description: "ID do evento" }),
  teamId: t.Numeric({ description: "ID do time" }),
});

const LinkVenueParam = t.Object({
  id: t.Numeric({ description: "ID do evento" }),
  stadiumId: t.Numeric({ description: "ID da sede" }),
});

export const eventRoutes = new Elysia({ prefix: "/event" })
  .use(authPlugin)
  // CREATE (admin)
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
      beforeHandle: requireAdmin,
      body: EventBody,
      response: { 200: EventResponse, 401: ErrorResponse, 403: ErrorResponse, 500: ErrorResponse },
      detail: { summary: "Criar um novo evento (admin)", tags: ["Events"] },
    },
  )
  // READ (UC01 - primeiro evento)
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
      response: { 200: EventResponse, 500: ErrorResponse },
      detail: {
        summary: "Buscar evento principal",
        description: "Retorna o primeiro evento cadastrado no sistema (UC01).",
        tags: ["Events"],
      },
    },
  )
  // READ (listagem de todos os eventos — feed multi-evento)
  .get(
    "/list",
    async () => {
      try {
        return await eventService.getAllEvents();
      } catch {
        throw new Error("Erro ao listar os eventos.");
      }
    },
    {
      response: { 200: EventListResponse, 500: ErrorResponse },
      detail: { summary: "Listar todos os eventos", tags: ["Events"] },
    },
  )
  // READ (partidas de um evento)
  .get(
    "/:id/matches",
    async ({ params: { id } }) => {
      try {
        return await matchService.getMatchesByEvent(id);
      } catch {
        throw new Error("Erro ao buscar as partidas do evento.");
      }
    },
    {
      params: IdParam,
      response: { 200: MatchListResponse, 500: ErrorResponse },
      detail: { summary: "Listar partidas de um evento", tags: ["Events"] },
    },
  )
  // READ (times de um evento)
  .get(
    "/:id/teams",
    async ({ params: { id } }) => {
      try {
        return await eventService.getEventTeams(id);
      } catch {
        throw new Error("Erro ao buscar os times do evento.");
      }
    },
    {
      params: IdParam,
      response: { 200: TeamListResponse, 500: ErrorResponse },
      detail: { summary: "Listar times de um evento", tags: ["Events"] },
    },
  )
  // READ (sedes de um evento)
  .get(
    "/:id/venues",
    async ({ params: { id } }) => {
      try {
        return await eventService.getEventVenues(id);
      } catch {
        throw new Error("Erro ao buscar as sedes do evento.");
      }
    },
    {
      params: IdParam,
      response: { 200: VenueListResponse, 500: ErrorResponse },
      detail: { summary: "Listar sedes de um evento", tags: ["Events"] },
    },
  )
  // READ (classificação de um evento)
  .get(
    "/:id/ranking",
    async ({ params: { id } }) => {
      try {
        return await rankingService.getRanking(id);
      } catch {
        throw new Error("Erro ao gerar a classificação do evento.");
      }
    },
    {
      params: IdParam,
      response: { 200: RankingResponse, 500: ErrorResponse },
      detail: { summary: "Classificação de um evento", tags: ["Events"] },
    },
  )
  // READ (partida em destaque / placar dinâmico)
  .get(
    "/:id/highlight",
    async ({ params: { id } }) => {
      try {
        return await eventService.getHighlightMatch(id);
      } catch {
        throw new Error("Erro ao buscar a partida em destaque.");
      }
    },
    {
      params: IdParam,
      response: { 200: t.Nullable(MatchWithRelationsResponse), 500: ErrorResponse },
      detail: {
        summary: "Partida em destaque do evento (placar dinâmico)",
        description:
          "Retorna a partida em andamento ou, na ausência dela, o próximo confronto agendado.",
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
      response: { 200: EventResponse, 500: ErrorResponse },
      detail: { summary: "Buscar evento por ID", tags: ["Events"] },
    },
  )
  // UPDATE (admin)
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
      beforeHandle: requireAdmin,
      params: IdParam,
      body: EventBody,
      response: { 200: EventResponse, 401: ErrorResponse, 403: ErrorResponse, 500: ErrorResponse },
      detail: { summary: "Atualizar evento (admin)", tags: ["Events"] },
    },
  )
  // DELETE (admin)
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
      beforeHandle: requireAdmin,
      params: IdParam,
      response: { 200: EventResponse, 401: ErrorResponse, 403: ErrorResponse, 500: ErrorResponse },
      detail: { summary: "Excluir evento (admin)", tags: ["Events"] },
    },
  )
  // LINK time ao evento (admin)
  .post(
    "/:id/teams/:teamId",
    async ({ params: { id, teamId } }) => {
      try {
        await eventService.linkTeam(id, teamId);
        return { message: "Time vinculado ao evento com sucesso." };
      } catch {
        throw new Error("Erro ao vincular o time ao evento.");
      }
    },
    {
      beforeHandle: requireAdmin,
      params: LinkTeamParam,
      response: {
        200: t.Object({ message: t.String() }),
        401: ErrorResponse,
        403: ErrorResponse,
        500: ErrorResponse,
      },
      detail: { summary: "Vincular um time ao evento (admin)", tags: ["Events"] },
    },
  )
  // UNLINK time do evento (admin)
  .delete(
    "/:id/teams/:teamId",
    async ({ params: { id, teamId } }) => {
      try {
        await eventService.unlinkTeam(id, teamId);
        return { message: "Time removido do evento com sucesso." };
      } catch {
        throw new Error("Erro ao remover o time do evento.");
      }
    },
    {
      beforeHandle: requireAdmin,
      params: LinkTeamParam,
      response: {
        200: t.Object({ message: t.String() }),
        401: ErrorResponse,
        403: ErrorResponse,
        500: ErrorResponse,
      },
      detail: { summary: "Remover um time do evento (admin)", tags: ["Events"] },
    },
  )
  // LINK sede ao evento (admin)
  .post(
    "/:id/venues/:stadiumId",
    async ({ params: { id, stadiumId } }) => {
      try {
        await eventService.linkVenue(id, stadiumId);
        return { message: "Sede vinculada ao evento com sucesso." };
      } catch {
        throw new Error("Erro ao vincular a sede ao evento.");
      }
    },
    {
      beforeHandle: requireAdmin,
      params: LinkVenueParam,
      response: {
        200: t.Object({ message: t.String() }),
        401: ErrorResponse,
        403: ErrorResponse,
        500: ErrorResponse,
      },
      detail: { summary: "Vincular uma sede ao evento (admin)", tags: ["Events"] },
    },
  )
  // UNLINK sede do evento (admin)
  .delete(
    "/:id/venues/:stadiumId",
    async ({ params: { id, stadiumId } }) => {
      try {
        await eventService.unlinkVenue(id, stadiumId);
        return { message: "Sede removida do evento com sucesso." };
      } catch {
        throw new Error("Erro ao remover a sede do evento.");
      }
    },
    {
      beforeHandle: requireAdmin,
      params: LinkVenueParam,
      response: {
        200: t.Object({ message: t.String() }),
        401: ErrorResponse,
        403: ErrorResponse,
        500: ErrorResponse,
      },
      detail: { summary: "Remover uma sede do evento (admin)", tags: ["Events"] },
    },
  );
