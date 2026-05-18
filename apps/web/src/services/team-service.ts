import { apiClient } from '../lib/api-client';
import type { Team, NewTeam, UpdateTeam } from '../types/api-types';

export const teamService = {
  getAllTeams: () =>
    apiClient.get<Team[]>('/team'),

  getTeamById: (id: number) =>
    apiClient.get<Team>(`/team/${id}`),

  createTeam: (data: NewTeam) =>
    apiClient.post<Team>('/team', data),

  updateTeam: (id: number, data: UpdateTeam) =>
    apiClient.put<Team>(`/team/${id}`, data),

  deleteTeam: (id: number) =>
    apiClient.delete<Team>(`/team/${id}`),
};
