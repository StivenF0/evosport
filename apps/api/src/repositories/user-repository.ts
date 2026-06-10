import type { UserRole } from "@packages/types";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
}

export const userRepository = {
  // CREATE
  async create(data: CreateUserData) {
    try {
      const [created] = await db.insert(users).values(data).returning();
      if (!created) {
        throw new Error("Falha ao criar o usuário.");
      }
      return created;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao criar o usuário.");
    }
  },

  // READ (One by email) — usado no login
  async findByEmail(email: string) {
    try {
      const [found] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return found ?? null;
    } catch {
      throw new Error("Erro ao buscar o usuário por email.");
    }
  },

  // READ (One by id)
  async findById(id: number) {
    try {
      const [found] = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (!found) {
        throw new Error("Usuário não encontrado.");
      }
      return found;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro interno ao buscar o usuário.");
    }
  },

  // UPDATE (name)
  async update(id: number, data: { name: string }) {
    try {
      const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
      if (!updated) {
        throw new Error("Usuário não encontrado para atualização.");
      }
      return updated;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao atualizar o usuário.");
    }
  },
};
