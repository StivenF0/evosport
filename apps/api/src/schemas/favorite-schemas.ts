import { t } from "elysia";
import { EventResponse } from "./event-schemas";

/** Lista de eventos favoritados pelo usuário. */
export const FavoriteListResponse = t.Array(EventResponse);

/** Resposta de confirmação ao favoritar/desfavoritar. */
export const FavoriteResponse = t.Object({
  id: t.Number({ description: "ID do registro de favorito" }),
  userId: t.Number({ description: "ID do usuário" }),
  eventId: t.Number({ description: "ID do evento favoritado" }),
  createdAt: t.Date({ description: "Data em que o evento foi favoritado" }),
});

export const FavoriteMessageResponse = t.Object({
  message: t.String({ description: "Mensagem informativa" }),
});
