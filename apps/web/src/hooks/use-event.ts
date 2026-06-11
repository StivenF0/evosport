import { useQuery } from "@tanstack/react-query";
import { eventService } from "../services/event-service";

export const eventKeys = {
  all: ["event"] as const,
  list: ["event", "list"] as const,
  detail: (id: number) => ["event", id] as const,
  matches: (id: number) => ["event", id, "matches"] as const,
  teams: (id: number) => ["event", id, "teams"] as const,
  venues: (id: number) => ["event", id, "venues"] as const,
  ranking: (id: number) => ["event", id, "ranking"] as const,
  highlight: (id: number) => ["event", id, "highlight"] as const,
};

export const usePrimaryEvent = () =>
  useQuery({ queryKey: eventKeys.all, queryFn: eventService.getPrimaryEvent });

export const useEvents = () =>
  useQuery({ queryKey: eventKeys.list, queryFn: eventService.getAllEvents });

export const useEvent = (id: number) =>
  useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventService.getEventById(id),
    enabled: Number.isFinite(id),
  });

export const useEventMatches = (id: number) =>
  useQuery({
    queryKey: eventKeys.matches(id),
    queryFn: () => eventService.getEventMatches(id),
    enabled: Number.isFinite(id),
  });

export const useEventTeams = (id: number) =>
  useQuery({
    queryKey: eventKeys.teams(id),
    queryFn: () => eventService.getEventTeams(id),
    enabled: Number.isFinite(id),
  });

export const useEventVenues = (id: number) =>
  useQuery({
    queryKey: eventKeys.venues(id),
    queryFn: () => eventService.getEventVenues(id),
    enabled: Number.isFinite(id),
  });

export const useEventRanking = (id: number) =>
  useQuery({
    queryKey: eventKeys.ranking(id),
    queryFn: () => eventService.getEventRanking(id),
    enabled: Number.isFinite(id),
  });

export const useEventHighlight = (id: number) =>
  useQuery({
    queryKey: eventKeys.highlight(id),
    queryFn: () => eventService.getEventHighlight(id),
    enabled: Number.isFinite(id),
  });
