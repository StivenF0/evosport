import { describe, expect, it, beforeEach, spyOn } from 'bun:test';
import { teamService } from '@api/services/team-service';
import { teamRepository } from '@api/repositories/team-repository';

describe('TeamService - Create Team', () => {
  beforeEach(() => {
    spyOn(teamRepository, 'create').mockRestore();
  });

  it('should create a new team.', async () => {
    spyOn(teamRepository, 'create').mockResolvedValue({
      id: 1,
      name: 'Brasil',
      flagUrl: 'https://flagsapi.com/BR/flat/64.png'
    });

    const team = await teamService.createTeam({
      name: 'Brasil',
      flagUrl: 'https://flagsapi.com/BR/flat/64.png'
    });

    expect(team).not.toBeNull();
    expect(team?.name).toBe('Brasil');
  });

  it('should throw an error if team failed to be created.', async () => {
    spyOn(teamRepository, 'create').mockRejectedValue(new Error('Falha ao criar o time.'));

    const team = teamService.createTeam({
      name: 'Brasil'
    });

    expect(team).rejects.toThrow('Erro ao criar o time.');
  });
});

describe('TeamService - Find By Id', () => {
  beforeEach(() => {
    spyOn(teamRepository, 'findById').mockRestore();
  });

  it('should return a team by ID.', async () => {
    spyOn(teamRepository, 'findById').mockResolvedValue({
      id: 1,
      name: 'Brasil',
      flagUrl: 'https://flagsapi.com/BR/flat/64.png'
    });

    const team = await teamService.getTeamById(1);

    expect(team).not.toBeNull();
    expect(team?.id).toBe(1);
  });

  it('should throw an error if no team was found by ID.', async () => {
    spyOn(teamRepository, 'findById').mockRejectedValue(new Error('Time não encontrado.'));

    const team = teamService.getTeamById(99);

    expect(team).rejects.toThrow('Erro ao buscar o time específico.');
  });
});

describe('TeamService - Find All', () => {
  beforeEach(() => {
    spyOn(teamRepository, 'findAll').mockRestore();
  });

  it('should return all teams.', async () => {
    spyOn(teamRepository, 'findAll').mockResolvedValue([
      { id: 1, name: 'Brasil', flagUrl: 'link' },
      { id: 2, name: 'Argentina', flagUrl: 'link' }
    ]);

    const teams = await teamService.getAllTeams();

    expect(teams).not.toBeArrayOfSize(0);
    expect(teams[0]?.name).toBe('Brasil');
    expect(teams[1]?.name).toBe('Argentina');
  });

  it('should throw an error if finding teams fails.', async () => {
    spyOn(teamRepository, 'findAll').mockRejectedValue(new Error('Erro interno.'));

    const teams = teamService.getAllTeams();

    expect(teams).rejects.toThrow('Erro ao buscar os times.');
  });
});

describe('TeamService - Update Team', () => {
  beforeEach(() => {
    spyOn(teamRepository, 'update').mockRestore();
  });

  it('should update a team.', async () => {
    spyOn(teamRepository, 'update').mockResolvedValue({
      id: 1,
      name: 'Brasil Atualizado',
      flagUrl: 'link'
    });

    const team = await teamService.updateTeam(1, { name: 'Brasil Atualizado' });

    expect(team).not.toBeNull();
    expect(team?.name).toBe('Brasil Atualizado');
  });

  it('should throw an error if team update fails.', async () => {
    spyOn(teamRepository, 'update').mockRejectedValue(new Error('Time não encontrado.'));

    const team = teamService.updateTeam(99, { name: 'Teste' });

    expect(team).rejects.toThrow('Erro ao atualizar o time.');
  });
});

describe('TeamService - Delete Team', () => {
  beforeEach(() => {
    spyOn(teamRepository, 'delete').mockRestore();
  });

  it('should delete a team.', async () => {
    spyOn(teamRepository, 'delete').mockResolvedValue({
      id: 1,
      name: 'Brasil',
      flagUrl: 'link'
    });

    const team = await teamService.deleteTeam(1);

    expect(team).not.toBeNull();
    expect(team?.id).toBe(1);
  });

  it('should throw an error if team deletion fails.', async () => {
    spyOn(teamRepository, 'delete').mockRejectedValue(new Error('Time não encontrado.'));

    const team = teamService.deleteTeam(99);

    expect(team).rejects.toThrow('Erro ao excluir o time.');
  });
});
