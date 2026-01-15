// src/dtos/query.dto.ts
import { z } from 'zod';
import { SpecialistStatus } from '../entities/Specialist.entity';

export const QuerySpecialistsSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
  status: z.nativeEnum(SpecialistStatus).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['created_at', 'name', 'updated_at']).optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});

export type QuerySpecialistsDto = z.infer<typeof QuerySpecialistsSchema>;