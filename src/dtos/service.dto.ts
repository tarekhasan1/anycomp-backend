// src/dtos/service.dto.ts
import { z } from 'zod';

export const CreateServiceOfferingSchema = z.object({
  specialist_id: z.string().uuid(),
  service_name: z.string().min(1, 'Service name is required'),
  service_type: z.string().optional(),
  description: z.string().optional(),
  platform_fee_id: z.string().uuid().optional(),
});

export const UpdateServiceOfferingSchema = z.object({
  service_name: z.string().min(1).optional(),
  service_type: z.string().optional(),
  description: z.string().optional(),
  platform_fee_id: z.string().uuid().optional(),
});

export type CreateServiceOfferingDto = z.infer<typeof CreateServiceOfferingSchema>;
export type UpdateServiceOfferingDto = z.infer<typeof UpdateServiceOfferingSchema>;

