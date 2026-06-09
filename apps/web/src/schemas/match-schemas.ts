import { z } from "zod";

export const matchStatusSchema = z.enum(["agendado", "em_andamento", "encerrado"]);

export const matchSchema = z
  .object({
    homeTeamId: z.number().int().positive("Selecione o time da casa"),
    awayTeamId: z.number().int().positive("Selecione o time visitante"),
    stadiumId: z.number().int().positive("Selecione o estádio"),
    date: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    status: matchStatusSchema.optional().default("agendado"),
  })
  .refine((data) => data.homeTeamId !== data.awayTeamId, {
    message: "O time da casa não pode ser o mesmo que o time visitante",
    path: ["awayTeamId"],
  });

export type MatchFormData = z.infer<typeof matchSchema>;
