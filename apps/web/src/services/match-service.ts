import { apiClient } from "../lib/api-client";
import type {
  Match,
  MatchGroupedByDate,
  MatchStatus,
  NewMatch,
  UpdateMatch,
} from "../types/api-types";

export interface MatchFilters {
  eventId?: number;
  status?: MatchStatus;
  sort?: "asc" | "desc";
}

export const matchService = {
  getAllMatches: (filters: MatchFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.eventId) params.set("eventId", String(filters.eventId));
    if (filters.status) params.set("status", filters.status);
    if (filters.sort) params.set("sort", filters.sort);
    const qs = params.toString();
    return apiClient.get<Match[]>(`/match${qs ? `?${qs}` : ""}`);
  },

  getMatchById: (id: number) => apiClient.get<Match>(`/match/${id}`),

  getMatchesGroupedByDate: () => apiClient.get<MatchGroupedByDate>("/match/grouped-by-date"),

  createMatch: (data: NewMatch) => apiClient.post<Match>("/match", data),

  updateMatch: (id: number, data: UpdateMatch) => apiClient.put<Match>(`/match/${id}`, data),

  deleteMatch: (id: number) => apiClient.delete<Match>(`/match/${id}`),
};
