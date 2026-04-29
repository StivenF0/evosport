import { Elysia } from 'elysia';
import { rankingService } from '../services/ranking-service';

export const rankingRoutes = new Elysia({ prefix: '/ranking' })
  // READ (Calculated Ranking - UC04)
  .get('/', async () => {
    try {
      return await rankingService.getRanking();
    } catch {
      throw new Error('Erro ao gerar a tabela de classificação.');
    }
  });
