import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { venueService } from "../services/venue-service";
import type { UpdateVenue } from "../types/api-types";

export const venueKeys = {
  all: ["venues"] as const,
};

export const useVenues = () =>
  useQuery({ queryKey: venueKeys.all, queryFn: venueService.getAllVenues });

export const useCreateVenue = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: venueService.createVenue,
    onSuccess: () => qc.invalidateQueries({ queryKey: venueKeys.all }),
  });
};

export const useUpdateVenue = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVenue }) =>
      venueService.updateVenue(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: venueKeys.all }),
  });
};

export const useDeleteVenue = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => venueService.deleteVenue(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: venueKeys.all }),
  });
};
