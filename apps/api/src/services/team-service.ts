import { teamRepository } from '../repositories/team-repository';
import type { NewTeam, UpdateTeam } from '@packages/types/teams-types';
// import { teams } from '../db/schema';

export const teamService = {
  // CREATE
  async createTeam(data: NewTeam) {
    try {
      return await teamRepository.create(data);
    } catch (error) {
      throw new Error('Erro ao criar o time.');
    }
  },

  // READ (All)
  async getAllTeams() {
    try {
      return await teamRepository.findAll();
    } catch (error) {
      throw new Error('Erro ao buscar os times.');
    }
  },

  // READ (One)
  async getTeamById(id: number) {
    try {
      return await teamRepository.findById(id);
    } catch (error) {
      throw new Error('Erro ao buscar o time específico.');
    }
  },

  // UPDATE
  async updateTeam(id: number, data: UpdateTeam) {
    try {
      return await teamRepository.update(id, data);
    } catch (error) {
      throw new Error('Erro ao atualizar o time.');
    }
  },

  // DELETE
  async deleteTeam(id: number) {
    try {
      return await teamRepository.delete(id);
    } catch (error) {
      throw new Error('Erro ao excluir o time.');
    }
  }
};
