import { singleton } from 'tsyringe';
import { EmailDto } from '../shared';
import { isUndefined } from 'lodash';
import { ApiRes } from '@/lib/response';
import { TokenEnum } from '@/constants';
import { Request, Response } from 'express';
import { BadRequestError } from '@/lib/errors';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { RegisterDto, VerifyEmailDto } from './auth.dtos';

@singleton()
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  // Extract token from request
  private getToken(req: Request): string {
    // Check if token is in request body or cookies
    const token = req.body?.token || req.cookies[TokenEnum.REFRESH];
    // Throw error if token is undefined
    if (isUndefined(token)) {
      throw new BadRequestError(
        'Refresh Token is required in (body or cookies)',
      );
    }
    return token;
  }

  // User login endpoint
  async login(req: Request, res: Response) {
    // Generate access and refresh tokens
    const { access, refresh } = await this.tokenService.generate(req.user.id);
    // Set access token in cookie
    res.cookie('access', access.token, {
      httpOnly: true,
      maxAge: access.maxAge,
    });
    // Set refresh token in cookie
    res.cookie('refresh', refresh.token, {
      httpOnly: true,
      maxAge: refresh.maxAge,
    });
    // Prepare response data
    const data = Object.assign(req.user.toJSON(), {
      access: access.token,
      refresh: refresh.token,
    });
    // Return success response
    return ApiRes.ok(data, 'Login successfully');
  }

  // User registration endpoint
  async register(req: Request<any, any, RegisterDto>) {
    // Extract request body
    const body = req.body;
    // Register user and get response details
    const { hash, ttl } = await this.authService.register(body);
    // Return success response with registration details
    return ApiRes.created({ hash, ttl });
  }

  // Verify email OTP endpoint
  async verifyOtp(req: Request<any, any, VerifyEmailDto>) {
    // Extract request body
    const body = req.body;
    // Verify email OTP and get user details
    const user = await this.authService.verifyEmailOtp(body);
    // Return success response with verified user details
    return ApiRes.ok(user, 'User verify successfully');
  }

  // Resend email OTP endpoint
  async resentOtp(req: Request<any, any, EmailDto>) {
    // Extract email from request body
    const { email } = req.body;
    // Resend email OTP and get response details
    const { hash, ttl } = await this.authService.resentEmailOtp(email);
    // Return success response with resent OTP details
    return ApiRes.ok({ hash, ttl });
  }

  // Refresh access token endpoint
  async refresh(req: Request, res: Response) {
    // Get refresh token from request
    const token = this.getToken(req);
    // Refresh access token and get new access token details
    const access = await this.tokenService.refreshAccessToken(token);
    // Set new access token in cookie
    res.cookie('access', access.token, {
      httpOnly: true,
      maxAge: access.maxAge,
    });
    // Return success response with new access token
    return ApiRes.ok(access, 'Token refresh successfully');
  }

  // User logout endpoint
  async logout(req: Request, res: Response) {
    // Get refresh token from request
    const token = this.getToken(req);
    // Block refresh token
    await this.tokenService.blockRefreshToken(token);
    // Clear access and refresh tokens from cookies
    res.clearCookie('access');
    res.clearCookie('refresh');
    // Return success response
    return ApiRes.ok(null, 'Logout successfully');
  }
}
