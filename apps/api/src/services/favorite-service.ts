import { eventRepository } from "../repositories/event-repository";
import { favoriteRepository } from "../repositories/favorite-repository";

export const favoriteService = {
  // READ (eventos favoritados do usuário logado)
  async getUserFavorites(userId: number) {
    const favorites = await favoriteRepository.findByUser(userId);
    return favorites.map((favorite) => favorite.event);
  },

  // CREATE (favoritar um evento — idempotente)
  async addFavorite(userId: number, eventId: number) {
    // Garante que o evento existe antes de favoritar
    await eventRepository.findById(eventId);

    const existing = await favoriteRepository.exists(userId, eventId);
    if (existing) {
      return existing;
    }
    return await favoriteRepository.add(userId, eventId);
  },

  // DELETE (desfavoritar um evento)
  async removeFavorite(userId: number, eventId: number) {
    await favoriteRepository.remove(userId, eventId);
    return { message: "Evento removido dos favoritos." };
  },
};
