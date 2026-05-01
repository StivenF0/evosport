import { db } from '../db';
import { event } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { NewEvent, UpdateEvent } from '@packages/types';

export const eventRepository = {
  // CREATE
  async create(data: NewEvent) {
    const [created] = await db.insert(event).values(data).returning();
    if (!created) throw new Error('Falha ao criar o evento.');
    return created;
  },

  // READ (All)
  async findAll() {
    const found = await db.select().from(event);
    if (!found) throw new Error('Falha ao encontrar o evento.');
    return found;
  },

  // READ (One)
  async findById(id: number) {
    const [found] = await db.select().from(event).where(eq(event.id, id)).limit(1);
    if (!found) throw new Error('Evento não encontrado.');
    return found;
  },

  // UPDATE
  async update(id: number, data: UpdateEvent) {
    const [updated] = await db.update(event).set(data).where(eq(event.id, id)).returning();
    if (!updated) throw new Error('Evento não encontrado para atualização.');
    return updated;
  },

  // DELETE
  async delete(id: number) {
    const [deleted] = await db.delete(event).where(eq(event.id, id)).returning();
    if (!deleted) throw new Error('Evento não encontrado para exclusão.');
    return deleted;
  }
};
