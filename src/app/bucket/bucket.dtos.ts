import * as z from 'zod';

export const UploadFileDto = z.object({
  folder: z.string(),
});

// types
export type UploadFileDto = z.TypeOf<typeof UploadFileDto>;
