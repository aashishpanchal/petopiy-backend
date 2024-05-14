import { config } from '@/config';
import { singleton } from 'tsyringe';
import { UserService } from '@/app/user';
import { ForbiddenError } from '@/lib/errors';
import { Notification, OTP } from '@/app/shared';
import { RegisterDto, VerifyEmailDto } from '../auth.dtos';

@singleton()
export class AuthService {
  constructor(
    private otp: OTP,
    private userService: UserService,
    private notification: Notification,
  ) {}

  async auth(username: string, password: string) {
    // check user is validate or not
    const user = await this.userService.validateUser(username, password);
    // check user account is blocked
    if (user.is_blocked) throw new ForbiddenError('User is blocked');
    return user;
  }

  async register(registerDto: RegisterDto) {
    // create new user account
    const user = await this.userService.create(registerDto);
    // create otp
    const { otp, ttl, hash } = this.otp.generate(user.email);
    // send otp to user email
    await this.notification.onEmail({
      to: user.email,
      subject: `Verify your email to ${config.NAME}`,
      template: 'verification-email',
      context: {
        otp,
        issuer: config.NAME,
      },
    });
    return { ttl, hash };
  }

  async resentEmailOtp(email: string) {
    const user = await this.userService.findByEmail(email);
    // check user is already active
    if (user.is_active)
      throw new ForbiddenError('user account already activated.');
    // create otp
    const { otp, ttl, hash } = this.otp.generate(user.email);
    // send otp to user email
    await this.notification.onEmail({
      to: user.email,
      subject: `Verify your email to ${config.NAME}`,
      template: 'verification-email',
      context: {
        otp,
        issuer: config.NAME,
      },
    });
    return { ttl, hash };
  }

  async verifyEmailOtp({ hash, otp, email }: VerifyEmailDto) {
    // verify otp
    const isVerify = this.otp.verify(email, otp, hash);
    // check otp is valid or not
    if (!isVerify) throw new ForbiddenError('Invalid OTP');
    // find user by email
    let user = await this.userService.findByEmail(email);
    // check user is already active
    if (user.is_active)
      throw new ForbiddenError('user account already activated.');
    // update user account
    user.is_active = true;
    // save update
    user = await user.save();
    // send welcome email
    await this.notification.onEmail({
      to: user.email,
      subject: `Welcome to ${config.NAME}`,
      template: 'welcome-email',
      context: {
        issuer: config.NAME,
        username: user.username,
      },
    });
    return user;
  }
}
