import * as z from 'zod';
import { isValidObjectId } from 'mongoose';

export const EmailDto = z.object({
  email: z.string().email(),
});

export const MongoIdDto = z.object({
  id: z.string().refine((value: string) => isValidObjectId(value), {
    message: 'Invalid Mongodb id.',
  }),
});

export type EmailDto = z.infer<typeof EmailDto>;
export type MongoIdDto = z.infer<typeof MongoIdDto>;
