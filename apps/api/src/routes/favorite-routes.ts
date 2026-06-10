import { Elysia, t } from "elysia";
import { authPlugin, requireAuth } from "../plugins/auth";
import {
  FavoriteListResponse,
  FavoriteMessageResponse,
  FavoriteResponse,
} from "../schemas/favorite-schemas";
import { ErrorResponse } from "../schemas/shared-schemas";
import { favoriteService } from "../services/favorite-service";

const EventIdParam = t.Object({
  eventId: t.Numeric({ description: "ID do evento" }),
});

export const favoriteRoutes = new Elysia({ prefix: "/favorites" })
  .use(authPlugin)
  // READ (favoritos do usuário logado)
  .get("/", async ({ currentUser }) => favoriteService.getUserFavorites(currentUser?.id ?? 0), {
    beforeHandle: requireAuth,
    response: { 200: FavoriteListResponse, 401: ErrorResponse },
    detail: { summary: "Listar eventos favoritados do usuário logado", tags: ["Favorites"] },
  })
  // CREATE (favoritar um evento)
  .post(
    "/:eventId",
    async ({ params: { eventId }, currentUser }) =>
      favoriteService.addFavorite(currentUser?.id ?? 0, eventId),
    {
      beforeHandle: requireAuth,
      params: EventIdParam,
      response: { 200: FavoriteResponse, 401: ErrorResponse, 500: ErrorResponse },
      detail: { summary: "Favoritar um evento", tags: ["Favorites"] },
    },
  )
  // DELETE (desfavoritar um evento)
  .delete(
    "/:eventId",
    async ({ params: { eventId }, currentUser }) =>
      favoriteService.removeFavorite(currentUser?.id ?? 0, eventId),
    {
      beforeHandle: requireAuth,
      params: EventIdParam,
      response: { 200: FavoriteMessageResponse, 401: ErrorResponse, 500: ErrorResponse },
      detail: { summary: "Remover um evento dos favoritos", tags: ["Favorites"] },
    },
  );
