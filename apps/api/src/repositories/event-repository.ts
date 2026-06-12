import type { NewEvent, UpdateEvent } from "@packages/types";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { event, eventStadiums, eventTeams } from "../db/schema";

export const eventRepository = {
  // CREATE
  async create(data: NewEvent) {
    const [created] = await db.insert(event).values(data).returning();
    if (!created) throw new Error("Falha ao criar o evento.");
    return created;
  },

  // READ (All)
  async findAll() {
    const found = await db.select().from(event);
    if (!found) throw new Error("Falha ao encontrar o evento.");
    return found;
  },

  // READ (One)
  async findById(id: number) {
    const [found] = await db.select().from(event).where(eq(event.id, id)).limit(1);
    if (!found) throw new Error("Evento não encontrado.");
    return found;
  },

  // UPDATE
  async update(id: number, data: UpdateEvent) {
    const [updated] = await db.update(event).set(data).where(eq(event.id, id)).returning();
    if (!updated) throw new Error("Evento não encontrado para atualização.");
    return updated;
  },

  // DELETE
  async delete(id: number) {
    const [deleted] = await db.delete(event).where(eq(event.id, id)).returning();
    if (!deleted) throw new Error("Evento não encontrado para exclusão.");
    return deleted;
  },

  // READ (times vinculados a um evento via tabela de junção)
  async findTeamsByEvent(eventId: number) {
    const rows = await db.query.eventTeams.findMany({
      where: eq(eventTeams.eventId, eventId),
      with: { team: true },
    });
    return rows.map((row) => row.team);
  },

  // READ (sedes vinculadas a um evento via tabela de junção)
  async findStadiumsByEvent(eventId: number) {
    const rows = await db.query.eventStadiums.findMany({
      where: eq(eventStadiums.eventId, eventId),
      with: { stadium: true },
    });
    return rows.map((row) => row.stadium);
  },

  // LINK (vincula um time a um evento — idempotente)
  async linkTeam(eventId: number, teamId: number) {
    const [existing] = await db
      .select()
      .from(eventTeams)
      .where(and(eq(eventTeams.eventId, eventId), eq(eventTeams.teamId, teamId)))
      .limit(1);
    if (existing) return existing;
    const [created] = await db.insert(eventTeams).values({ eventId, teamId }).returning();
    if (!created) throw new Error("Falha ao vincular o time ao evento.");
    return created;
  },

  // UNLINK (remove o vínculo de um time com um evento)
  async unlinkTeam(eventId: number, teamId: number) {
    const [deleted] = await db
      .delete(eventTeams)
      .where(and(eq(eventTeams.eventId, eventId), eq(eventTeams.teamId, teamId)))
      .returning();
    if (!deleted) throw new Error("Vínculo entre time e evento não encontrado.");
    return deleted;
  },

  // LINK (vincula uma sede a um evento — idempotente)
  async linkStadium(eventId: number, stadiumId: number) {
    const [existing] = await db
      .select()
      .from(eventStadiums)
      .where(and(eq(eventStadiums.eventId, eventId), eq(eventStadiums.stadiumId, stadiumId)))
      .limit(1);
    if (existing) return existing;
    const [created] = await db.insert(eventStadiums).values({ eventId, stadiumId }).returning();
    if (!created) throw new Error("Falha ao vincular a sede ao evento.");
    return created;
  },

  // UNLINK (remove o vínculo de uma sede com um evento)
  async unlinkStadium(eventId: number, stadiumId: number) {
    const [deleted] = await db
      .delete(eventStadiums)
      .where(and(eq(eventStadiums.eventId, eventId), eq(eventStadiums.stadiumId, stadiumId)))
      .returning();
    if (!deleted) throw new Error("Vínculo entre sede e evento não encontrado.");
    return deleted;
  },
};
