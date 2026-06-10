import type { NewMatch, UpdateMatch } from "@packages/types";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { matches } from "../db/schema";

export const matchRepository = {
  // CREATE
  async create(data: NewMatch) {
    try {
      const [created] = await db.insert(matches).values(data).returning();
      if (!created) {
        throw new Error("Falha ao criar a partida.");
      }
      return created;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao criar a partida.");
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
    } catch {
      throw new Error("Erro ao buscar as partidas e os times.");
    }
  },

  // READ (Partidas de um evento específico, com relações)
  async getByEvent(eventId: number) {
    try {
      return await db.query.matches.findMany({
        where: eq(matches.eventId, eventId),
        with: {
          homeTeam: true,
          awayTeam: true,
          stadium: true,
        },
      });
    } catch {
      throw new Error("Erro ao buscar as partidas do evento.");
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
        throw new Error("Partida não encontrada.");
      }

      return result;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro interno ao buscar a partida.");
    }
  },

  // UPDATE
  async update(id: number, data: UpdateMatch) {
    try {
      const [updated] = await db.update(matches).set(data).where(eq(matches.id, id)).returning();

      if (!updated) {
        throw new Error("Partida não encontrada para atualização.");
      }

      return updated;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao atualizar a partida.");
    }
  },

  // DELETE
  async delete(id: number) {
    try {
      const [deleted] = await db.delete(matches).where(eq(matches.id, id)).returning();

      if (!deleted) {
        throw new Error("Partida não encontrada para exclusão.");
      }

      return deleted;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao excluir a partida.");
    }
  },
};
