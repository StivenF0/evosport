import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamService } from '../services/team-service';

export const teamKeys = {
  all: ['teams'] as const,
};

export const useTeams = () =>
  useQuery({ queryKey: teamKeys.all, queryFn: teamService.getAllTeams });

export const useCreateTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: teamService.createTeam,
    onSuccess: () => qc.invalidateQueries({ queryKey: teamKeys.all })
  });
};
