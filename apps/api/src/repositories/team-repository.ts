import type { NewTeam, UpdateTeam } from "@packages/types";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { teams } from "../db/schema";

export const teamRepository = {
  // CREATE
  async create(data: NewTeam) {
    try {
      const [created] = await db.insert(teams).values(data).returning();
      if (!created) {
        throw new Error("Falha ao criar o time.");
      }
      return created;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao criar o time.");
    }
  },

  // READ (All)
  async findAll() {
    try {
      return await db.select().from(teams);
    } catch (error) {
      throw new Error("Erro ao buscar todos os times.");
    }
  },

  // READ (One)
  async findById(id: number) {
    try {
      const [found] = await db.select().from(teams).where(eq(teams.id, id)).limit(1);

      if (!found) {
        throw new Error("Time não encontrado.");
      }

      return found;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro interno ao buscar o time.");
    }
  },

  // UPDATE
  async update(id: number, data: UpdateTeam) {
    try {
      const [updated] = await db.update(teams).set(data).where(eq(teams.id, id)).returning();

      if (!updated) {
        throw new Error("Time não encontrado para atualização.");
      }

      return updated;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao atualizar o time.");
    }
  },

  // DELETE
  async delete(id: number) {
    try {
      const [deleted] = await db.delete(teams).where(eq(teams.id, id)).returning();

      if (!deleted) {
        throw new Error("Time não encontrado para exclusão.");
      }

      return deleted;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao excluir o time.");
    }
  },
};
