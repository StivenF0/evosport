import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type MatchFilters, matchService } from "../services/match-service";
import type { UpdateMatch } from "../types/api-types";
import { rankingKeys } from "./use-ranking";

export const matchKeys = {
  all: ["matches"] as const,
  list: (filters: MatchFilters) => ["matches", "list", filters] as const,
  grouped: ["matches", "grouped"] as const,
};

const invalidateMatches = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: matchKeys.all });
  qc.invalidateQueries({ queryKey: matchKeys.grouped });
  qc.invalidateQueries({ queryKey: rankingKeys.all });
  qc.invalidateQueries({ queryKey: ["event"] });
};

export const useMatches = (filters: MatchFilters = {}) =>
  useQuery({
    queryKey: matchKeys.list(filters),
    queryFn: () => matchService.getAllMatches(filters),
  });

export const useMatchesGrouped = () =>
  useQuery({ queryKey: matchKeys.grouped, queryFn: matchService.getMatchesGroupedByDate });

export const useCreateMatch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: matchService.createMatch,
    onSuccess: () => invalidateMatches(qc),
  });
};

export const useUpdateMatch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMatch }) =>
      matchService.updateMatch(id, data),
    onSuccess: () => invalidateMatches(qc),
  });
};

export const useDeleteMatch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => matchService.deleteMatch(id),
    onSuccess: () => invalidateMatches(qc),
  });
};
