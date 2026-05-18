import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchService } from '../services/match-service';
import { rankingKeys } from './use-ranking';

export const matchKeys = {
  all: ['matches'] as const,
  grouped: ['matches', 'grouped'] as const,
};

export const useMatches = () =>
  useQuery({ queryKey: matchKeys.all, queryFn: matchService.getAllMatches });

export const useMatchesGrouped = () =>
  useQuery({ queryKey: matchKeys.grouped, queryFn: matchService.getMatchesGroupedByDate });

export const useCreateMatch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: matchService.createMatch,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matchKeys.all });
      qc.invalidateQueries({ queryKey: matchKeys.grouped });
      qc.invalidateQueries({ queryKey: rankingKeys.all });
    }
  });
};
