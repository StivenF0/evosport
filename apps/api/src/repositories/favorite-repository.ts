import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { userFavorites } from "../db/schema";

export const favoriteRepository = {
  // READ (eventos favoritados de um usuário, com os dados do evento)
  async findByUser(userId: number) {
    try {
      return await db.query.userFavorites.findMany({
        where: eq(userFavorites.userId, userId),
        with: { event: true },
      });
    } catch {
      throw new Error("Erro ao buscar os favoritos do usuário.");
    }
  },

  // READ (verifica se um favorito já existe)
  async exists(userId: number, eventId: number) {
    try {
      const [found] = await db
        .select()
        .from(userFavorites)
        .where(and(eq(userFavorites.userId, userId), eq(userFavorites.eventId, eventId)))
        .limit(1);
      return found ?? null;
    } catch {
      throw new Error("Erro ao verificar o favorito.");
    }
  },

  // CREATE
  async add(userId: number, eventId: number) {
    try {
      const [created] = await db.insert(userFavorites).values({ userId, eventId }).returning();
      if (!created) {
        throw new Error("Falha ao adicionar o favorito.");
      }
      return created;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao adicionar o favorito.");
    }
  },

  // DELETE
  async remove(userId: number, eventId: number) {
    try {
      const [deleted] = await db
        .delete(userFavorites)
        .where(and(eq(userFavorites.userId, userId), eq(userFavorites.eventId, eventId)))
        .returning();
      if (!deleted) {
        throw new Error("Favorito não encontrado para remoção.");
      }
      return deleted;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao remover o favorito.");
    }
  },
};
