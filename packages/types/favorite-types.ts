export interface Favorite {
  id: number;
  userId: number;
  eventId: number;
}

export type NewFavorite = Omit<Favorite, "id">;
