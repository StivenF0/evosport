import { t } from "elysia";
import { TeamResponse } from "./team-schemas";
import { VenueResponse } from "./venue-schemas";

/**
 * Status permitidos para uma partida.
 */
export const MatchStatus = t.Union(
  [t.Literal("agendado"), t.Literal("em_andamento"), t.Literal("encerrado")],
  {
    description: "Status atual da partida",
  },
);

/**
 * Schema para os filtros (query string) da listagem de partidas.
 */
export const MatchQuery = t.Object({
  eventId: t.Optional(t.Numeric({ description: "Filtra por evento" })),
  status: t.Optional(MatchStatus),
  sort: t.Optional(
    t.Union([t.Literal("asc"), t.Literal("desc")], {
      description: "Ordenação por data (asc = mais antigas primeiro)",
    }),
  ),
});

/**
 * Schema para o corpo da requisição de criação/atualização de partida.
 */
export const MatchBody = t.Object({
  eventId: t.Number({
    description: "ID do evento ao qual a partida pertence",
  }),
  homeTeamId: t.Number({
    description: "ID do time da casa",
  }),
  awayTeamId: t.Number({
    description: "ID do time visitante",
  }),
  stadiumId: t.Number({
    description: "ID da sede/estádio onde ocorrerá a partida",
  }),
  date: t.Date({
    description: "Data e hora da partida",
  }),
  status: t.Optional(MatchStatus),
  homeScore: t.Optional(t.Nullable(t.Number({ description: "Placar do time da casa" }))),
  awayScore: t.Optional(t.Nullable(t.Number({ description: "Placar do time visitante" }))),
});

/**
 * Resposta base contendo apenas os campos da tabela 'matches'.
 * Usado em operações de escrita (POST, PUT, DELETE).
 */
export const MatchBaseResponse = t.Object({
  id: t.Number({ description: "ID único da partida" }),
  eventId: t.Number(),
  homeTeamId: t.Number(),
  awayTeamId: t.Number(),
  stadiumId: t.Number(),
  date: t.Date(),
  status: MatchStatus,
  homeScore: t.Nullable(t.Number()),
  awayScore: t.Nullable(t.Number()),
});

/**
 * Resposta completa contendo relações carregadas e campos calculados.
 * Usado em operações de leitura (GET).
 */
export const MatchWithRelationsResponse = t.Object({
  id: t.Number({ description: "ID único da partida" }),
  eventId: t.Number(),
  homeTeamId: t.Number(),
  awayTeamId: t.Number(),
  stadiumId: t.Number(),
  date: t.Date(),
  status: MatchStatus,
  homeScore: t.Nullable(t.Number()),
  awayScore: t.Nullable(t.Number()),
  formattedDate: t.String({
    description: "Data formatada em pt-BR (DD/MM/AAAA)",
  }),
  homeTeam: TeamResponse,
  awayTeam: TeamResponse,
  stadium: VenueResponse,
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
  t.String({ description: "Data formatada (DD/MM/AAAA)" }),
  t.Array(MatchWithRelationsResponse),
);

/**
 * Schema para partidas agrupadas por estádio.
 */
export const MatchGroupedByStadiumResponse = t.Record(
  t.String({ description: "Nome do estádio" }),
  t.Array(MatchWithRelationsResponse),
);
