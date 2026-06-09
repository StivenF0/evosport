import { apiClient } from "../lib/api-client";
import type { Ranking } from "../types/api-types";

export const rankingService = {
  /**
   * Obtém a tabela de classificação calculada pelo backend
   */
  getRanking: () => apiClient.get<Ranking>("/ranking"),
};
