import * as z from 'zod';
import { RoleEnum } from '@/constants';

export const CreateUserDto = z.object({
  username: z.string().min(2).max(20),
  email: z.string().email(),
  fullname: z.string(),
  password: z.string().min(8).max(32),
  // Role is an optional enum value from Roles enum
  role: z.optional(z.nativeEnum(RoleEnum)),
  avatar: z.string().url().optional(),
  is_blocked: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

// updates user dto
export const UpdateUserDto = CreateUserDto.partial();
export const UpdateMeDto = CreateUserDto.pick({
  avatar: true,
  fullname: true,
});

// Defining a type
export type CreateUserDto = z.TypeOf<typeof CreateUserDto>;
export type UpdateUserDto = z.TypeOf<typeof UpdateUserDto>;
export type UpdateMeDto = z.TypeOf<typeof UpdateMeDto>;
