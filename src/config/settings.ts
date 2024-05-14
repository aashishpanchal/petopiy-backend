import 'dotenv/config';
import { env } from './env';

// config data
export const config = Object.freeze({
  NAME: env.NAME,
  PORT: env.PORT,
  HOST: env.HOST,
  VERSION: '1.0.0',
  IS_DEV: env.NODE_ENV === 'development',
  // database
  DB_URL: env.DATABASE_URL,
  // jwt
  JWT: {
    ISSUER: env.NAME,
    SECRET: env.SECRET,
    ACCESS_EXP: env.JWT_ACCESS_EXP,
    REFRESH_EXP: env.JWT_REFRESH_EXP,
  },
  // smtp
  SMTP: {
    HOST: env.SMTP_HOST,
    PASS: env.SMTP_PASS,
    PORT: env.SMTP_PORT,
    USER: env.SMTP_USER,
    FROM: env.SMTP_FROM,
  },
  // otp
  OTP: {
    DIGITS: 6,
    EXPIRES_IN: '1m', // otp expires in 1 minute
    ISSUER: env.NAME,
    SECRET: env.SECRET,
  },
});
