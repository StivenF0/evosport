import { apiClient } from "../lib/api-client";
import type { Event, MessageResponse } from "../types/api-types";

interface Favorite {
  id: number;
  userId: number;
  eventId: number;
  createdAt: string;
}

export const favoriteService = {
  /** Eventos favoritados do usuário logado. */
  getFavorites: () => apiClient.get<Event[]>("/favorites"),

  /** Favorita um evento. */
  addFavorite: (eventId: number) => apiClient.post<Favorite>(`/favorites/${eventId}`, {}),

  /** Remove um evento dos favoritos. */
  removeFavorite: (eventId: number) => apiClient.delete<MessageResponse>(`/favorites/${eventId}`),
};
