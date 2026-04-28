import { eq } from 'drizzle-orm';
import { db } from '../db';
import type { NewTeam, UpdateTeam } from '@packages/types/teams-types';
import { teams } from '../db/schema';

export const teamRepository = {
  // CREATE
  async create(data: NewTeam) {
    try {
      const result = await db.insert(teams).values(data).returning();
      return result[0];
    } catch (error) {
      throw new Error('Erro ao criar o time.');
    }
  },

  // READ (All)
  async findAll() {
    try {
      return await db.select().from(teams);
    } catch (error) {
      throw new Error('Erro ao buscar todos os times.');
    }
  },

  // READ (One)
  async findById(id: number) {
    try {
      const result = await db.select().from(teams).where(eq(teams.id, id)).limit(1);

      if (!result.length) {
        throw new Error('Time não encontrado.');
      }

      return result[0];
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Erro interno ao buscar o time.');
    }
  },

  // UPDATE
  async update(id: number, data: UpdateTeam) {
    try {
      const result = await db
        .update(teams)
        .set(data)
        .where(eq(teams.id, id))
        .returning();

      if (!result.length) {
        throw new Error('Time não encontrado para atualização.');
      }

      return result[0];
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Erro ao atualizar o time.');
    }
  },

  // DELETE
  async delete(id: number) {
    try {
      const result = await db
        .delete(teams)
        .where(eq(teams.id, id))
        .returning();

      if (!result.length) {
        throw new Error('Time não encontrado para exclusão.');
      }

      return result[0];
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Erro ao excluir o time.');
    }
  }
};
