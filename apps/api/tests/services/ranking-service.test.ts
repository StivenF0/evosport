import { describe, expect, it, beforeEach, spyOn } from 'bun:test';
import { rankingService } from '@api/services/ranking-service';
import { rankingRepository } from '@api/repositories/ranking-repository';

describe('RankingService - Get Ranking', () => {
  beforeEach(() => {
    spyOn(rankingRepository, 'getFinishedMatches').mockRestore();
  });

  it('should calculate and return the correct ranking order.', async () => {
    spyOn(rankingRepository, 'getFinishedMatches').mockResolvedValue([
      {
        id: 1, homeTeamId: 1, awayTeamId: 2, stadiumId: 1, date: new Date(), status: 'encerrado',
        homeScore: 2, awayScore: 1,
        homeTeam: { id: 1, name: 'Brasil', flagUrl: '' },
        awayTeam: { id: 2, name: 'Argentina', flagUrl: '' }
      },
      {
        id: 2, homeTeamId: 3, awayTeamId: 1, stadiumId: 1, date: new Date(), status: 'encerrado',
        homeScore: 1, awayScore: 1,
        homeTeam: { id: 3, name: 'França', flagUrl: '' },
        awayTeam: { id: 1, name: 'Brasil', flagUrl: '' }
      }
    ] as any);

    const ranking = await rankingService.getRanking();

    expect(ranking).not.toBeNull();
    expect(ranking).toBeArrayOfSize(3);

    expect(ranking[0]?.name).toBe('Brasil');
    expect(ranking[0]?.points).toBe(4);
    expect(ranking[0]?.played).toBe(2);
    expect(ranking[0]?.goalDifference).toBe(1);

    expect(ranking[1]?.name).toBe('França');
    expect(ranking[1]?.points).toBe(1);

    expect(ranking[2]?.name).toBe('Argentina');
    expect(ranking[2]?.points).toBe(0);
  });

  it('should throw an error if repository fails.', async () => {
    spyOn(rankingRepository, 'getFinishedMatches').mockRejectedValue(new Error('DB Error'));

    const ranking = rankingService.getRanking();

    expect(ranking).rejects.toThrow('Erro ao calcular a tabela de classificação.');
  });
});
