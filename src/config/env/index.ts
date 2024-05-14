import 'dotenv/config';
import { EnvSchema } from './schema';
import { validateEnv } from '@/lib/utils';

// validate env
export const env = validateEnv<EnvSchema>(EnvSchema);
