import { Elysia } from "elysia";
import { authPlugin, requireAdmin } from "../plugins/auth";
import {
  MatchBaseResponse,
  MatchBody,
  MatchGroupedByDateResponse,
  MatchListResponse,
  MatchQuery,
  MatchWithRelationsResponse,
} from "../schemas/match-schemas";
import { ErrorResponse, IdParam } from "../schemas/shared-schemas";
import { matchService } from "../services/match-service";

export const matchRoutes = new Elysia({ prefix: "/match" })
  .use(authPlugin)
  // CREATE (admin)
  .post(
    "/",
    async ({ body }) => {
      try {
        return await matchService.createMatch(body);
      } catch {
        throw new Error("Erro ao criar a partida.");
      }
    },
    {
      beforeHandle: requireAdmin,
      body: MatchBody,
      response: {
        200: MatchBaseResponse,
        401: ErrorResponse,
        403: ErrorResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Criar uma nova partida (admin)",
        tags: ["Matches"],
      },
    },
  )
  // READ (All - UC02 e UC03 listagem com datas formatadas, filtros opcionais)
  .get(
    "/",
    async ({ query }) => {
      try {
        return await matchService.getAllMatches({
          eventId: query.eventId,
          status: query.status,
          order: query.sort,
        });
      } catch {
        throw new Error("Erro ao buscar as partidas.");
      }
    },
    {
      query: MatchQuery,
      response: {
        200: MatchListResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Listar partidas (com filtros por evento/status e ordenação)",
        description: "Retorna a listagem de partidas com datas formatadas em pt-BR (UC02, UC03).",
        tags: ["Matches"],
      },
    },
  )
  // READ (Grouped by Date - Extra para facilitar a UI)
  .get(
    "/grouped-by-date",
    async () => {
      try {
        return await matchService.getMatchesGroupedByDate();
      } catch {
        throw new Error("Erro ao agrupar as partidas por data.");
      }
    },
    {
      response: {
        200: MatchGroupedByDateResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Listar partidas agrupadas por data",
        tags: ["Matches"],
      },
    },
  )
  // READ (One)
  .get(
    "/:id",
    async ({ params: { id } }) => {
      try {
        return await matchService.getMatchById(id);
      } catch {
        throw new Error("Erro ao buscar a partida específica.");
      }
    },
    {
      params: IdParam,
      response: {
        200: MatchWithRelationsResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Buscar partida por ID",
        tags: ["Matches"],
      },
    },
  )
  // UPDATE
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      try {
        return await matchService.updateMatch(id, body);
      } catch {
        throw new Error("Erro ao atualizar a partida.");
      }
    },
    {
      beforeHandle: requireAdmin,
      params: IdParam,
      body: MatchBody,
      response: {
        200: MatchBaseResponse,
        401: ErrorResponse,
        403: ErrorResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Atualizar partida (admin)",
        tags: ["Matches"],
      },
    },
  )
  // DELETE (admin)
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      try {
        return await matchService.deleteMatch(id);
      } catch {
        throw new Error("Erro ao excluir a partida.");
      }
    },
    {
      beforeHandle: requireAdmin,
      params: IdParam,
      response: {
        200: MatchBaseResponse,
        401: ErrorResponse,
        403: ErrorResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Excluir partida (admin)",
        tags: ["Matches"],
      },
    },
  );
