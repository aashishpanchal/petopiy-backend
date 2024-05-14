import { config } from '@/config';
import { container } from 'tsyringe';
import { TokenEnum } from '@/constants';
import { UserService } from '@/app/user';
import { UnauthorizedError } from '@/lib/errors';
import { Strategy, ExtractJwt } from 'passport-jwt';

/**
 * Access token strategy
 */
export const JwtStrategy = new Strategy(
  {
    secretOrKey: config.JWT.SECRET,
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      (req) => req.cookies?.[TokenEnum.ACCESS] || null,
    ]),
  },
  async (payload, done) => {
    try {
      if (payload.type !== TokenEnum.ACCESS)
        throw new UnauthorizedError(`jwt token type invalid.`);
      // find user
      const user = await container.resolve(UserService).findById(payload.sub);
      // check user is not blocked
      if (user.is_blocked)
        throw new UnauthorizedError('user account is blocked.');
      // return user to done callback function
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  },
);
