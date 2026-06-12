import type { NewEvent, UpdateEvent } from "@packages/types";
import { eventRepository } from "../repositories/event-repository";
import { matchService } from "./match-service";

export const eventService = {
  // CREATE
  async createEvent(data: NewEvent) {
    try {
      return await eventRepository.create(data);
    } catch {
      throw new Error("Erro ao criar o evento.");
    }
  },

  // READ (All)
  async getAllEvents() {
    try {
      return await eventRepository.findAll();
    } catch {
      throw new Error("Erro ao buscar os eventos.");
    }
  },

  // READ (One)
  async getEventById(id: number) {
    try {
      return await eventRepository.findById(id);
    } catch {
      throw new Error("Erro ao buscar o evento específico.");
    }
  },

  // UPDATE
  async updateEvent(id: number, data: UpdateEvent) {
    try {
      return await eventRepository.update(id, data);
    } catch {
      throw new Error("Erro ao atualizar o evento.");
    }
  },

  // DELETE
  async deleteEvent(id: number) {
    try {
      return await eventRepository.delete(id);
    } catch {
      throw new Error("Erro ao excluir o evento.");
    }
  },

  // READ (times vinculados ao evento)
  async getEventTeams(id: number) {
    try {
      return await eventRepository.findTeamsByEvent(id);
    } catch {
      throw new Error("Erro ao buscar os times do evento.");
    }
  },

  // READ (sedes vinculadas ao evento)
  async getEventVenues(id: number) {
    try {
      return await eventRepository.findStadiumsByEvent(id);
    } catch {
      throw new Error("Erro ao buscar as sedes do evento.");
    }
  },

  /**
   * Placar dinâmico / partida em destaque de um evento.
   * Regra: prioriza a partida "em_andamento"; na ausência dela,
   * retorna o próximo confronto "agendado" (data futura mais próxima).
   * Retorna `null` quando o evento não tem partida em destaque.
   */
  async getHighlightMatch(id: number) {
    try {
      const matches = await matchService.getMatchesByEvent(id);

      const live = matches.find((match) => match.status === "em_andamento");
      if (live) return live;

      const now = Date.now();
      const upcoming = matches
        .filter((match) => match.status === "agendado" && new Date(match.date).getTime() >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return upcoming[0] ?? null;
    } catch {
      throw new Error("Erro ao buscar a partida em destaque do evento.");
    }
  },

  // LINK / UNLINK de times e sedes (uso administrativo)
  async linkTeam(eventId: number, teamId: number) {
    try {
      return await eventRepository.linkTeam(eventId, teamId);
    } catch {
      throw new Error("Erro ao vincular o time ao evento.");
    }
  },

  async unlinkTeam(eventId: number, teamId: number) {
    try {
      return await eventRepository.unlinkTeam(eventId, teamId);
    } catch {
      throw new Error("Erro ao remover o time do evento.");
    }
  },

  async linkVenue(eventId: number, stadiumId: number) {
    try {
      return await eventRepository.linkStadium(eventId, stadiumId);
    } catch {
      throw new Error("Erro ao vincular a sede ao evento.");
    }
  },

  async unlinkVenue(eventId: number, stadiumId: number) {
    try {
      return await eventRepository.unlinkStadium(eventId, stadiumId);
    } catch {
      throw new Error("Erro ao remover a sede do evento.");
    }
  },
};
