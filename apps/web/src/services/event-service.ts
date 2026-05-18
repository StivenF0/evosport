import { apiClient } from '../lib/api-client';
import type { Event, NewEvent, UpdateEvent } from '../types/api-types';

export const eventService = {
  /**
   * Obtém o evento principal (UC01 - primeiro cadastrado)
   */
  getPrimaryEvent: () =>
    apiClient.get<Event>('/event'),

  getEventById: (id: number) =>
    apiClient.get<Event>(`/event/${id}`),

  createEvent: (data: NewEvent) =>
    apiClient.post<Event>('/event', data),

  updateEvent: (id: number, data: UpdateEvent) =>
    apiClient.put<Event>(`/event/${id}`, data),

  deleteEvent: (id: number) =>
    apiClient.delete<Event>(`/event/${id}`),
};
