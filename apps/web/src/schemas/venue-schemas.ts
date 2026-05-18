import { z } from 'zod';

export const venueSchema = z.object({
  name: z.string().min(1, 'O nome da sede é obrigatório'),
  city: z.string().min(1, 'A cidade é obrigatória'),
  capacity: z.number().int().positive('A capacidade deve ser um número positivo').nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

export type VenueFormData = z.infer<typeof venueSchema>;
