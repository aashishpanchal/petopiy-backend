import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { singleton } from 'tsyringe';
import { UnauthorizedError } from '@/lib/errors';

export interface JwtPayload extends jwt.JwtPayload {
  type?: string;
}

@singleton()
export class JwtToken {
  readonly #secret = config.JWT.SECRET;
  readonly #issuer = config.JWT.ISSUER;

  /**
   * create jwt payload
   */
  payload(sub: string, extra?: Record<string, any>): JwtPayload {
    return { jti: crypto.randomUUID(), iss: this.#issuer, sub, ...extra };
  }

  /**
   * create jwt token
   */
  create(payload: JwtPayload, options?: jwt.SignOptions) {
    // create jwt token
    return jwt.sign(payload, this.#secret, options);
  }

  /**
   * verify jwt token
   */
  verify<T = JwtPayload>(token: string, options?: jwt.VerifyOptions): T {
    try {
      return jwt.verify(token, this.#secret, options) as T;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError)
        throw new UnauthorizedError('Jwt token is expired');
      if (error instanceof jwt.JsonWebTokenError)
        throw new UnauthorizedError(error.message);
      throw error;
    }
  }
}
