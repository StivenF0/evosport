import { apiClient } from '../lib/api-client';
import type { Venue, NewVenue, UpdateVenue } from '../types/api-types';

export const venueService = {
  getAllVenues: () =>
    apiClient.get<Venue[]>('/venue'),

  getVenueById: (id: number) =>
    apiClient.get<Venue>(`/venue/${id}`),

  createVenue: (data: NewVenue) =>
    apiClient.post<Venue>('/venue', data),

  updateVenue: (id: number, data: UpdateVenue) =>
    apiClient.put<Venue>(`/venue/${id}`, data),

  deleteVenue: (id: number) =>
    apiClient.delete<Venue>(`/venue/${id}`),
};
