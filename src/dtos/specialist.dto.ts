// src/dtos/specialist.dto.ts
import { z } from 'zod';
import { SpecialistStatus } from '../entities/Specialist.entity';

export const CreateSpecialistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  contact_email: z.string().email('Invalid email address'),
  contact_phone: z.string().optional(),
  website_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  logo_id: z.string().uuid().optional(),
  service_offerings: z
    .array(
      z.object({
        service_name: z.string().min(1, 'Service name is required'),
        service_type: z.string().optional(),
        description: z.string().optional(),
        platform_fee_id: z.string().uuid().optional(),
      })
    )
    .optional(),
});

export const UpdateSpecialistSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  website_url: z.string().url().optional().or(z.literal('')),
  logo_id: z.string().uuid().optional(),
  status: z.nativeEnum(SpecialistStatus).optional(),
  service_offerings: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        service_name: z.string().min(1),
        service_type: z.string().optional(),
        description: z.string().optional(),
        platform_fee_id: z.string().uuid().optional(),
      })
    )
    .optional(),
});

export const PublishSpecialistSchema = z.object({
  status: z.nativeEnum(SpecialistStatus),
});

export type CreateSpecialistDto = z.infer<typeof CreateSpecialistSchema>;
export type UpdateSpecialistDto = z.infer<typeof UpdateSpecialistSchema>;
export type PublishSpecialistDto = z.infer<typeof PublishSpecialistSchema>;

