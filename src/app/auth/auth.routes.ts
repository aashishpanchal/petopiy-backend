import passport from 'passport';
import { Router } from 'express';
import { AuthEnum } from '@/constants';
import { validate } from '@/middlewares';
import { JwtAuth, LocalAuth } from './middlewares';
import { EmailDto } from '../shared/default.dtos';
import { AuthController } from './auth.controller';
import { controllerFactory } from '@/lib/controller';
import { JwtStrategy, LocalStrategy } from './strategies';
import { LoginDto, RegisterDto, VerifyEmailDto } from './auth.dtos';

export const authRoutes = () => {
  // initialize passport strategies
  passport.use(AuthEnum.JWT, JwtStrategy);
  passport.use(AuthEnum.LOCAL, LocalStrategy);

  // create controller
  const controller = controllerFactory(AuthController);

  // create router
  const router: Router = Router();

  // initialize router
  router
    .route('/login')
    .post(validate.body(LoginDto), LocalAuth, controller.getMethod('login'));
  router
    .route('/register')
    .post(validate.body(RegisterDto), controller.getMethod('register'));
  router
    .route('/verify-otp')
    .post(validate.body(VerifyEmailDto), controller.getMethod('verifyOtp'));
  router
    .route('/resent-otp')
    .post(validate.body(EmailDto), controller.getMethod('resentOtp'));
  router.route('/refresh-token').post(controller.getMethod('refresh'));
  router.route('/logout').post(JwtAuth, controller.getMethod('logout'));

  return router;
};
