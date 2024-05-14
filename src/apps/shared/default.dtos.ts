import * as z from 'zod';

export const EmailDto = z.object({
  email: z.string().email(),
});

export const MongoIdDto = z.object({
  id: z.string().uuid(),
});

export type EmailDto = z.infer<typeof EmailDto>;
export type MongoIdDto = z.infer<typeof MongoIdDto>;
