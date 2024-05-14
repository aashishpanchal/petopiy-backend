import ms from 'ms';
import { config } from '@/config';
import { TokenEnum } from '@/constants';
import { JwtToken } from '@/apps/shared';
import { inject, singleton } from 'tsyringe';
import { Token, TokenModel } from '@/models';
import { UnauthorizedError } from '@/lib/errors';

type Payload = {
  user: string;
  save: boolean;
  type: TokenEnum;
  expiresIn: string;
  [key: string]: any;
};

@singleton()
export class TokenService {
  constructor(
    @inject(Token.name) private readonly tokenModel: TokenModel,
    private readonly jwtToken: JwtToken,
  ) {}

  async isBlock(jti: string) {
    const token = await this.tokenModel.findOne({ jti });
    // check token is blocked or not
    if (token?.is_block) throw new UnauthorizedError('Token is blocked');
  }

  async doBlock(jti: string) {
    const token = await this.tokenModel.findOneAndUpdate(
      { jti },
      { is_block: true, blocked_at: new Date() },
    );
    return token;
  }

  async verify(token: string, type: TokenEnum) {
    // verify token
    const payload = this.jwtToken.verify(token);
    // check token type
    if (payload.type !== type)
      throw new UnauthorizedError('Token type is invalid');
    return payload;
  }

  async create({ expiresIn, save, user, ...payload }: Payload) {
    // generate payload
    const _payload = this.jwtToken.payload(user, payload);
    // generate token
    const token = this.jwtToken.create(_payload, { expiresIn });
    // save token
    if (save)
      await this.tokenModel.create({
        user,
        jti: _payload.jti,
        type: payload.type,
        blocked_at: null,
        expires_at: new Date(Date.now() + ms(expiresIn)),
      });

    return token;
  }

  async refreshToken(user: string) {
    const exp = config.JWT.REFRESH_EXP;
    // create token
    const token = await this.create({
      user,
      save: true,
      type: TokenEnum.REFRESH,
      expiresIn: exp,
    });
    return { token, maxAge: ms(exp) };
  }

  async accessToken(user: string) {
    const exp = config.JWT.ACCESS_EXP;
    // create token
    const token = await this.create({
      user,
      save: false,
      type: TokenEnum.ACCESS,
      expiresIn: exp,
    });
    return { token, maxAge: ms(exp) };
  }

  async generate(user: string) {
    // generate access and refresh token
    const [access, refresh] = await Promise.all([
      this.accessToken(user),
      this.refreshToken(user),
    ]);
    return { access, refresh };
  }

  async refreshAccessToken(token: string) {
    // verify token
    const payload = await this.verify(token, TokenEnum.REFRESH);
    // check token is blocked, throw error
    await this.isBlock(payload.jti);
    // generate new token
    return await this.accessToken(payload.sub);
  }

  async blockRefreshToken(token: string) {
    // verify token
    const payload = await this.verify(token, TokenEnum.REFRESH);
    // check token is blocked, throw error
    await this.isBlock(payload.jti);
    // block token
    return await this.doBlock(payload.jti);
  }
}
