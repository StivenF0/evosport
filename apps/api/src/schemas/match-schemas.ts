import { t } from 'elysia';
import { TeamResponse } from './team-schemas';
import { VenueResponse } from './venue-schemas';

/**
 * Status permitidos para uma partida.
 */
export const MatchStatus = t.Union([
  t.Literal('agendado'),
  t.Literal('em_andamento'),
  t.Literal('encerrado')
], {
  description: 'Status atual da partida'
});

/**
 * Schema para o corpo da requisição de criação/atualização de partida.
 */
export const MatchBody = t.Object({
  homeTeamId: t.Number({
    description: 'ID do time da casa'
  }),
  awayTeamId: t.Number({
    description: 'ID do time visitante'
  }),
  stadiumId: t.Number({
    description: 'ID da sede/estádio onde ocorrerá a partida'
  }),
  date: t.Date({
    description: 'Data e hora da partida'
  }),
  status: t.Optional(MatchStatus)
});

/**
 * Resposta base contendo apenas os campos da tabela 'matches'.
 * Usado em operações de escrita (POST, PUT, DELETE).
 */
export const MatchBaseResponse = t.Object({
  id: t.Number({ description: 'ID único da partida' }),
  homeTeamId: t.Number(),
  awayTeamId: t.Number(),
  stadiumId: t.Number(),
  date: t.Date(),
  status: MatchStatus
});

/**
 * Resposta completa contendo relações carregadas e campos calculados.
 * Usado em operações de leitura (GET).
 */
export const MatchWithRelationsResponse = t.Object({
  id: t.Number({ description: 'ID único da partida' }),
  homeTeamId: t.Number(),
  awayTeamId: t.Number(),
  stadiumId: t.Number(),
  date: t.Date(),
  status: MatchStatus,
  formattedDate: t.String({
    description: 'Data formatada em pt-BR (DD/MM/AAAA)'
  }),
  homeTeam: TeamResponse,
  awayTeam: TeamResponse,
  stadium: VenueResponse
});

/**
 * Schema para listagem de partidas com relações.
 */
export const MatchListResponse = t.Array(MatchWithRelationsResponse);

/**
 * Schema para partidas agrupadas por data.
 * A chave do objeto é a data formatada (ex: "15/06/2026").
 */
export const MatchGroupedByDateResponse = t.Record(
  t.String({ description: 'Data formatada (DD/MM/AAAA)' }),
  t.Array(MatchWithRelationsResponse)
);

/**
 * Schema para partidas agrupadas por estádio.
 */
export const MatchGroupedByStadiumResponse = t.Record(
  t.String({ description: 'Nome do estádio' }),
  t.Array(MatchWithRelationsResponse)
);
