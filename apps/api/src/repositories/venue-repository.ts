import type { NewVenue, UpdateVenue } from "@packages/types";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { stadiums } from "../db/schema";

export const venueRepository = {
  // CREATE
  async create(data: NewVenue) {
    try {
      const [created] = await db.insert(stadiums).values(data).returning();
      if (!created) {
        throw new Error("Falha ao criar a sede.");
      }
      return created;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao criar a sede.");
    }
  },

  // READ (All)
  async findAll() {
    try {
      return await db.select().from(stadiums);
    } catch (error) {
      throw new Error("Erro ao obter todas as sedes.");
    }
  },

  // READ (One)
  async findById(id: number) {
    try {
      const [found] = await db.select().from(stadiums).where(eq(stadiums.id, id)).limit(1);

      if (!found) {
        throw new Error("Sede não encontrada.");
      }

      return found;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro interno ao procurar a sede.");
    }
  },

  // UPDATE
  async update(id: number, data: UpdateVenue) {
    try {
      const [updated] = await db.update(stadiums).set(data).where(eq(stadiums.id, id)).returning();

      if (!updated) {
        throw new Error("Sede não encontrada para atualização.");
      }

      return updated;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao atualizar a sede.");
    }
  },

  // DELETE
  async delete(id: number) {
    try {
      const [deleted] = await db.delete(stadiums).where(eq(stadiums.id, id)).returning();

      if (!deleted) {
        throw new Error("Sede não encontrada para eliminação.");
      }

      return deleted;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao eliminar a sede.");
    }
  },
};
