import { t } from 'elysia';

export const EventBody = t.Object({
  name: t.String({
    description: 'Nome do evento esportivo',
    examples: ['Copa do Mundo 2026']
  }),
  startDate: t.Date({
    description: 'Data de início do evento'
  }),
  endDate: t.Date({
    description: 'Data de término do evento'
  }),
  logoUrl: t.Optional(t.Nullable(t.String({
    description: 'URL do logotipo do evento',
    examples: ['https://example.com/logo.png']
  })))
});

export const EventResponse = t.Object({
  id: t.Number({ description: 'ID único do evento' }),
  name: t.String(),
  startDate: t.Date(),
  endDate: t.Date(),
  logoUrl: t.Nullable(t.String())
});

export const EventListResponse = t.Array(EventResponse);
