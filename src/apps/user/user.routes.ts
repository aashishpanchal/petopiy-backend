import { Router } from 'express';
import { validate } from '@/middlewares';
import { JwtAuth } from '../auth/middlewares';
import { UserController } from './user.controller';
import { controllerFactory } from '@/lib/controller';
import { UpdateMeDto } from './user.dtos';

export const userRoutes = () => {
  // make v1 router
  const router: Router = Router();

  // create controller
  const controller = controllerFactory(UserController);

  // middleware
  router.use(JwtAuth);

  // initialize router
  router
    .route('/me')
    .get(controller.getMethod('getMe'))
    .put(validate.body(UpdateMeDto), controller.getMethod('updateMe'));

  return router;
};
