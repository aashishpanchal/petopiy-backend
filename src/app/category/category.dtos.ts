import * as z from 'zod';
import { isMongoId } from '../shared';

// Zod schema for Category DTO
export const CreateCategoryDto = z.object({
  parent: isMongoId().nullable().optional(), // Ref<Category> as string for simplicity
  name: z.string().min(1),
  slug: z.string().min(1),
  img: isMongoId().optional(), // Ref<Media> as string for simplicity
  description: z.string().optional(),
  status: z.boolean().default(true),
});

export const UpdateCategoryDto = CreateCategoryDto.partial();

// Type for Category DTO
export type CreateCategoryDto = z.infer<typeof CreateCategoryDto>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategoryDto>;
