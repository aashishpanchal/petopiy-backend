import * as z from 'zod';
import { isMongoId } from '../shared';

export const CreateBrandDto = z.object({
  name: z.string(),
  slug: z.string(),
  img: isMongoId(),
  status: z.boolean(),
  description: z.string(),
});

export const UpdateBrandDto = CreateBrandDto.partial();

// types
export type CreateBrandDto = z.infer<typeof CreateBrandDto>;
export type UpdateBrandDto = z.infer<typeof UpdateBrandDto>;
