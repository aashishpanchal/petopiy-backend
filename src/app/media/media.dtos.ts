import * as z from 'zod';

export const GetSignedUrlDto = z.object({
  key: z.string(),
  size: z
    .number()
    .int()
    .positive()
    .max(1024 * 1024 * 5), // 5GB
  mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg']),
  name: z.string(),
});

export const UpdateMediaDto = GetSignedUrlDto.omit({ key: true });

export type GetSignedUrlDto = z.infer<typeof GetSignedUrlDto>;
export type UpdateMediaDto = z.infer<typeof UpdateMediaDto>;
