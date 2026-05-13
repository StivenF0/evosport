import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@web/lib/api';
import type { Event, Match, Team, Venue, Ranking } from '@packages/types';

// Fetch do Evento Principal
export function useEvent() {
  return useQuery({
    queryKey: ['event'],
    queryFn: () => apiFetch<Event>('/event'),
  });
}

// Fetch do Ranking Calculado
export function useRanking() {
  return useQuery({
    queryKey: ['ranking'],
    queryFn: () => apiFetch<Ranking>('/ranking'),
  });
}

// Fetch das Partidas
export function useMatches() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: () => apiFetch<Match[]>('/matches'),
  });
}

// Fetch das Sedes (Estádios/Mapas)
export function useVenues() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: () => apiFetch<Venue[]>('/venues'),
  });
}

// Fetch dos Times
export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => apiFetch<Team[]>('/teams'),
  });
}
