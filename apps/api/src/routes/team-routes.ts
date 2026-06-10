import { Elysia } from "elysia";
import { authPlugin, requireAdmin } from "../plugins/auth";
import { ErrorResponse, IdParam } from "../schemas/shared-schemas";
import { TeamBody, TeamListResponse, TeamResponse } from "../schemas/team-schemas";
import { teamService } from "../services/team-service";

export const teamRoutes = new Elysia({ prefix: "/team" })
  .use(authPlugin)
  // CREATE (admin)
  .post(
    "/",
    async ({ body }) => {
      try {
        return await teamService.createTeam(body);
      } catch {
        throw new Error("Erro ao criar o time.");
      }
    },
    {
      beforeHandle: requireAdmin,
      body: TeamBody,
      response: {
        200: TeamResponse,
        401: ErrorResponse,
        403: ErrorResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Criar um novo time (admin)",
        tags: ["Teams"],
      },
    },
  )
  // READ (All - UC04 listagem de times)
  .get(
    "/",
    async () => {
      try {
        return await teamService.getAllTeams();
      } catch {
        throw new Error("Erro ao buscar os times.");
      }
    },
    {
      response: {
        200: TeamListResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Listar todos os times",
        description: "Retorna a listagem de todos os times cadastrados (UC04).",
        tags: ["Teams"],
      },
    },
  )
  // READ (One)
  .get(
    "/:id",
    async ({ params: { id } }) => {
      try {
        return await teamService.getTeamById(id);
      } catch {
        throw new Error("Erro ao buscar o time específico.");
      }
    },
    {
      params: IdParam,
      response: {
        200: TeamResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Buscar time por ID",
        tags: ["Teams"],
      },
    },
  )
  // UPDATE
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      try {
        return await teamService.updateTeam(id, body);
      } catch {
        throw new Error("Erro ao atualizar o time.");
      }
    },
    {
      beforeHandle: requireAdmin,
      params: IdParam,
      body: TeamBody,
      response: {
        200: TeamResponse,
        401: ErrorResponse,
        403: ErrorResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Atualizar time (admin)",
        tags: ["Teams"],
      },
    },
  )
  // DELETE (admin)
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      try {
        return await teamService.deleteTeam(id);
      } catch {
        throw new Error("Erro ao excluir o time.");
      }
    },
    {
      beforeHandle: requireAdmin,
      params: IdParam,
      response: {
        200: TeamResponse,
        401: ErrorResponse,
        403: ErrorResponse,
        500: ErrorResponse,
      },
      detail: {
        summary: "Excluir time (admin)",
        tags: ["Teams"],
      },
    },
  );
