import { useQuery } from "@tanstack/react-query";
import { rankingService } from "../services/ranking-service";

export const rankingKeys = {
  all: ["ranking"] as const,
};

export const useRanking = () =>
  useQuery({ queryKey: rankingKeys.all, queryFn: rankingService.getRanking });
