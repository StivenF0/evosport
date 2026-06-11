import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoriteService } from "../services/favorite-service";

export const favoriteKeys = {
  all: ["favorites"] as const,
};

export const useFavorites = () =>
  useQuery({ queryKey: favoriteKeys.all, queryFn: favoriteService.getFavorites });

export const useAddFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: number) => favoriteService.addFavorite(eventId),
    onSuccess: () => qc.invalidateQueries({ queryKey: favoriteKeys.all }),
  });
};

export const useRemoveFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: number) => favoriteService.removeFavorite(eventId),
    onSuccess: () => qc.invalidateQueries({ queryKey: favoriteKeys.all }),
  });
};
