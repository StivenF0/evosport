import { apiClient } from '../lib/api-client';
import type { Match, MatchGroupedByDate, NewMatch, UpdateMatch } from '../types/api-types';

export const matchService = {
  getAllMatches: () =>
    apiClient.get<Match[]>('/match'),

  getMatchById: (id: number) =>
    apiClient.get<Match>(`/match/${id}`),

  getMatchesGroupedByDate: () =>
    apiClient.get<MatchGroupedByDate>('/match/grouped-by-date'),

  createMatch: (data: NewMatch) =>
    apiClient.post<Match>('/match', data),

  updateMatch: (id: number, data: UpdateMatch) =>
    apiClient.put<Match>(`/match/${id}`, data),

  deleteMatch: (id: number) =>
    apiClient.delete<Match>(`/match/${id}`),
};
