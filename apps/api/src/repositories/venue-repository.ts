import { eq } from 'drizzle-orm';
import { db } from '../db';
import { stadiums } from '../db/schema';

type NewVenue = typeof stadiums.$inferInsert;
type UpdateVenue = Partial<NewVenue>;

export const venueRepository = {
  // CREATE
  async create(data: NewVenue) {
    try {
      const result = await db.insert(stadiums).values(data).returning();
      return result[0];
    } catch (error) {
      throw new Error('Erro ao criar a sede.');
    }
  },

  // READ (All)
  async findAll() {
    try {
      return await db.select().from(stadiums);
    } catch (error) {
      throw new Error('Erro ao obter todas as sedes.');
    }
  },

  // READ (One)
  async findById(id: number) {
    try {
      const result = await db.select().from(stadiums).where(eq(stadiums.id, id)).limit(1);

      if (!result.length) {
        throw new Error('Sede não encontrada.');
      }

      return result[0];
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Erro interno ao procurar a sede.');
    }
  },

  // UPDATE
  async update(id: number, data: UpdateVenue) {
    try {
      const result = await db
        .update(stadiums)
        .set(data)
        .where(eq(stadiums.id, id))
        .returning();

      if (!result.length) {
        throw new Error('Sede não encontrada para atualização.');
      }

      return result[0];
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Erro ao atualizar a sede.');
    }
  },

  // DELETE
  async delete(id: number) {
    try {
      const result = await db
        .delete(stadiums)
        .where(eq(stadiums.id, id))
        .returning();

      if (!result.length) {
        throw new Error('Sede não encontrada para eliminação.');
      }

      return result[0];
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Erro ao eliminar a sede.');
    }
  }
};
