import { eq } from 'drizzle-orm';
import { db } from '../db';
import { matches } from '../db/schema';

type NewMatch = typeof matches.$inferInsert;
type UpdateMatch = Partial<NewMatch>;

export const matchRepository = {
  // CREATE
  async create(data: NewMatch) {
    try {
      const result = await db.insert(matches).values(data).returning();
      return result[0];
    } catch (error) {
      throw new Error('Erro ao criar a partida.');
    }
  },

  // READ (Custom Join: Partidas + Times + Estádio)
  async getAllWithTeams() {
    try {
      // Utiliza a API Relacional do Drizzle (configurada via "relations" no schema)
      return await db.query.matches.findMany({
        with: {
          homeTeam: true,
          awayTeam: true,
          stadium: true,
        },
      });
    } catch (error) {
      throw new Error('Erro ao buscar as partidas e os times.');
    }
  },

  // READ (One)
  async findById(id: number) {
    try {
      const result = await db.query.matches.findFirst({
        where: eq(matches.id, id),
        with: {
          homeTeam: true,
          awayTeam: true,
          stadium: true,
        },
      });

      if (!result) {
        throw new Error('Partida não encontrada.');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Erro interno ao buscar a partida.');
    }
  },

  // UPDATE
  async update(id: number, data: UpdateMatch) {
    try {
      const result = await db
        .update(matches)
        .set(data)
        .where(eq(matches.id, id))
        .returning();

      if (!result.length) {
        throw new Error('Partida não encontrada para atualização.');
      }

      return result[0];
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Erro ao atualizar a partida.');
    }
  },

  // DELETE
  async delete(id: number) {
    try {
      const result = await db
        .delete(matches)
        .where(eq(matches.id, id))
        .returning();

      if (!result.length) {
        throw new Error('Partida não encontrada para exclusão.');
      }

      return result[0];
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Erro ao excluir a partida.');
    }
  }
};
