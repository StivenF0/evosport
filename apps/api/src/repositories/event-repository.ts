import { db } from '../db';
import { event } from '../db/schema';
import { eq } from 'drizzle-orm';

type NewEvent = typeof event.$inferInsert;
type UpdateEvent = Partial<NewEvent>;

export const eventRepository = {
  // CREATE
  async create(data: NewEvent) {
    const result = await db.insert(event).values(data).returning();
    if (!result.length) throw new Error('Falha ao criar o evento.');
    return result[0];
  },

  // READ (All)
  async findAll() {
    return await db.select().from(event);
  },

  // READ (One)
  async findById(id: number) {
    const result = await db.select().from(event).where(eq(event.id, id)).limit(1);
    if (!result.length) throw new Error('Evento não encontrado.');
    return result[0];
  },

  // UPDATE
  async update(id: number, data: UpdateEvent) {
    const result = await db.update(event).set(data).where(eq(event.id, id)).returning();
    if (!result.length) throw new Error('Evento não encontrado para atualização.');
    return result[0];
  },

  // DELETE
  async delete(id: number) {
    const result = await db.delete(event).where(eq(event.id, id)).returning();
    if (!result.length) throw new Error('Evento não encontrado para exclusão.');
    return result[0];
  }
};
