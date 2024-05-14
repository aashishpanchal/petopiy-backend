import * as z from 'zod';
import { EmailDto } from '../shared';

export const LoginDto = z.object({
  username: z.string(),
  password: z.string(),
});

export const RegisterDto = EmailDto.extend({
  username: z.string().min(2).max(20),
  fullname: z.string(),
  password: z.string(),
});

export const VerifyEmailDto = EmailDto.extend({
  hash: z.string(),
  otp: z.string().min(6),
});

// types
export type LoginDto = z.TypeOf<typeof LoginDto>;
export type RegisterDto = z.TypeOf<typeof RegisterDto>;
export type VerifyEmailDto = z.TypeOf<typeof VerifyEmailDto>;
