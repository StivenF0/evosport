import { t } from 'elysia';

export const VenueBody = t.Object({
  name: t.String({
    description: 'Nome do estádio ou sede',
    examples: ['Maracanã']
  }),
  city: t.String({
    description: 'Cidade onde a sede está localizada',
    examples: ['Rio de Janeiro']
  }),
  capacity: t.Optional(t.Nullable(t.Number({
    description: 'Capacidade máxima de público',
    examples: [78838]
  }))),
  latitude: t.Optional(t.Nullable(t.Number({
    description: 'Coordenada de latitude para o mapa'
  }))),
  longitude: t.Optional(t.Nullable(t.Number({
    description: 'Coordenada de longitude para o mapa'
  })))
});

export const VenueResponse = t.Object({
  id: t.Number({ description: 'ID único da sede' }),
  name: t.String({ description: 'Nome da sede' }),
  city: t.String({ description: 'Cidade da sede' }),
  capacity: t.Nullable(t.Number({ description: 'Capacidade de público' })),
  latitude: t.Nullable(t.Number({ description: 'Latitude para o mapa' })),
  longitude: t.Nullable(t.Number({ description: 'Longitude para o mapa' }))
});

export const VenueListResponse = t.Array(VenueResponse);
