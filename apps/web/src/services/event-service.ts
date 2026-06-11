import { apiClient } from "../lib/api-client";
import type { Event, Match, NewEvent, Ranking, Team, UpdateEvent, Venue } from "../types/api-types";

export const eventService = {
  /**
   * Obtém o evento principal (UC01 - primeiro cadastrado)
   */
  getPrimaryEvent: () => apiClient.get<Event>("/event"),

  /** Lista todos os eventos (feed multi-evento). */
  getAllEvents: () => apiClient.get<Event[]>("/event/list"),

  getEventById: (id: number) => apiClient.get<Event>(`/event/${id}`),

  /** Partidas de um evento (com relações e data formatada). */
  getEventMatches: (id: number) => apiClient.get<Match[]>(`/event/${id}/matches`),

  /** Times vinculados a um evento. */
  getEventTeams: (id: number) => apiClient.get<Team[]>(`/event/${id}/teams`),

  /** Sedes vinculadas a um evento. */
  getEventVenues: (id: number) => apiClient.get<Venue[]>(`/event/${id}/venues`),

  /** Classificação de um evento. */
  getEventRanking: (id: number) => apiClient.get<Ranking>(`/event/${id}/ranking`),

  /** Partida em destaque (placar dinâmico) — pode ser `null`. */
  getEventHighlight: (id: number) => apiClient.get<Match | null>(`/event/${id}/highlight`),

  createEvent: (data: NewEvent) => apiClient.post<Event>("/event", data),

  updateEvent: (id: number, data: UpdateEvent) => apiClient.put<Event>(`/event/${id}`, data),

  deleteEvent: (id: number) => apiClient.delete<Event>(`/event/${id}`),
};
