import * as z from 'zod';
import { isMongoId } from '../shared';

// Zod schema for Category DTO
export const CreateCategoryDto = z.object({
  child: isMongoId().nullable().optional(), // Ref<Category> as string for simplicity
  name: z.string(),
  slug: z.string(),
  img: isMongoId(), // Ref<Media> as string for simplicity
  description: z.string().optional(),
  status: z.boolean(),
});

export const UpdateCategoryDto = CreateCategoryDto.partial();

// Type for Category DTO
export type CreateCategoryDto = z.infer<typeof CreateCategoryDto>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategoryDto>;
