import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teamService } from "../services/team-service";
import type { UpdateTeam } from "../types/api-types";

export const teamKeys = {
  all: ["teams"] as const,
};

export const useTeams = () =>
  useQuery({ queryKey: teamKeys.all, queryFn: teamService.getAllTeams });

export const useCreateTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: teamService.createTeam,
    onSuccess: () => qc.invalidateQueries({ queryKey: teamKeys.all }),
  });
};

export const useUpdateTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTeam }) =>
      teamService.updateTeam(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: teamKeys.all }),
  });
};

export const useDeleteTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => teamService.deleteTeam(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: teamKeys.all }),
  });
};
