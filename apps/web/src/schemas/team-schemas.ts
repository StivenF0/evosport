import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(1, "O nome do time é obrigatório"),
  flagUrl: z.url("URL da bandeira inválida").nullable().optional(),
});

export type TeamFormData = z.infer<typeof teamSchema>;
