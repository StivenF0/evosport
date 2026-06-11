import { z } from "zod";

/** Converte string vazia/indefinida em null; caso contrário, número. */
const nullableNumber = z.preprocess(
  (v) => (v === "" || v === undefined || v === null ? null : Number(v)),
  z.number().nullable(),
);

export const adminEventSchema = z.object({
  name: z.string().min(1, "O nome do evento é obrigatório"),
  description: z.string().optional(),
  startDate: z.string().min(1, "A data de início é obrigatória"),
  endDate: z.string().min(1, "A data de término é obrigatória"),
  logoUrl: z.string().optional(),
});

export type AdminEventFormData = z.infer<typeof adminEventSchema>;

export const adminTeamSchema = z.object({
  name: z.string().min(1, "O nome do time é obrigatório"),
  flagUrl: z.string().optional(),
});

export type AdminTeamFormData = z.infer<typeof adminTeamSchema>;

export const adminVenueSchema = z.object({
  name: z.string().min(1, "O nome da sede é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  capacity: nullableNumber,
  latitude: nullableNumber,
  longitude: nullableNumber,
});

export type AdminVenueFormData = z.output<typeof adminVenueSchema>;
export type AdminVenueFormInput = z.input<typeof adminVenueSchema>;

export const adminMatchSchema = z
  .object({
    eventId: z.coerce.number().int().positive("Selecione o evento"),
    homeTeamId: z.coerce.number().int().positive("Selecione o time da casa"),
    awayTeamId: z.coerce.number().int().positive("Selecione o time visitante"),
    stadiumId: z.coerce.number().int().positive("Selecione a sede"),
    date: z.string().min(1, "A data é obrigatória"),
    status: z.enum(["agendado", "em_andamento", "encerrado"]),
    homeScore: nullableNumber,
    awayScore: nullableNumber,
  })
  .refine((data) => data.homeTeamId !== data.awayTeamId, {
    message: "O time da casa não pode ser o mesmo que o visitante",
    path: ["awayTeamId"],
  });

export type AdminMatchFormData = z.output<typeof adminMatchSchema>;
export type AdminMatchFormInput = z.input<typeof adminMatchSchema>;
