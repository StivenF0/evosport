import { matchRepository } from '../repositories/match-repository';
import type { NewMatch, UpdateMatch } from '@packages/types/match-types';
// import { matches } from '../db/schema';

const formatDateToBR = (date: Date | number | string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(date));
};

export const matchService = {
  // CREATE
  async createMatch(data: NewMatch) {
    try {
      return await matchRepository.create(data);
    } catch (error) {
      throw new Error('Erro ao criar a partida.');
    }
  },

  // READ (All formatted)
  async getAllMatches() {
    try {
      const result = await matchRepository.getAllWithTeams();
      return result.map(match => ({
        ...match,
        formattedDate: formatDateToBR(match.date)
      }));
    } catch (error) {
      throw new Error('Erro ao buscar as partidas.');
    }
  },

  // READ (One formatted)
  async getMatchById(id: number) {
    try {
      const match = await matchRepository.findById(id);
      return {
        ...match,
        formattedDate: formatDateToBR(match.date)
      };
    } catch (error) {
      throw new Error('Erro ao buscar a partida específica.');
    }
  },

  // UPDATE
  async updateMatch(id: number, data: UpdateMatch) {
    try {
      return await matchRepository.update(id, data);
    } catch (error) {
      throw new Error('Erro ao atualizar a partida.');
    }
  },

  // DELETE
  async deleteMatch(id: number) {
    try {
      return await matchRepository.delete(id);
    } catch (error) {
      throw new Error('Erro ao excluir a partida.');
    }
  },

  // BUSINESS RULES: Group by Date
  async getMatchesGroupedByDate() {
    try {
      const allMatches = await this.getAllMatches();

      return allMatches.reduce((acc, match) => {
        const dateKey = match.formattedDate;
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(match);
        return acc;
      }, {} as Record<string, typeof allMatches>);
    } catch (error) {
      throw new Error('Erro ao agrupar partidas por data.');
    }
  },

  // BUSINESS RULES: Group by Stadium
  async getMatchesGroupedByStadium() {
    try {
      const allMatches = await this.getAllMatches();

      return allMatches.reduce((acc, match) => {
        const stadiumName = match.stadium?.name || 'Sede Desconhecida';
        if (!acc[stadiumName]) acc[stadiumName] = [];
        acc[stadiumName].push(match);
        return acc;
      }, {} as Record<string, typeof allMatches>);
    } catch (error) {
      throw new Error('Erro ao agrupar partidas por estádio.');
    }
  }
};
