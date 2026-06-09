import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(1, "O nome do evento é obrigatório"),
  startDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  endDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  logoUrl: z.url("URL do logotipo inválida").nullable().optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;
