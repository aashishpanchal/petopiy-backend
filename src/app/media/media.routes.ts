import { Router } from 'express';
import { JwtAuth } from '../auth';
import { MongoIdDto } from '../shared';
import { validate } from '@/middlewares';
import { MediaController } from './media.controller';
import { controllerFactory } from '@/lib/controller';
import { GetSignedUrlDto, UpdateMediaDto } from './media.dtos';

export const mediaRoutes = () => {
  const router: Router = Router();
  // create controller
  const controller = controllerFactory(MediaController);
  // middlewares
  router.use(JwtAuth);
  // initialize router
  router
    .route('/')
    .post(validate.body(GetSignedUrlDto), controller.getMethod('create'));
  router
    .route('/:id')
    .get(validate.params(MongoIdDto), controller.getMethod('get'))
    .put(
      validate.body(UpdateMediaDto),
      validate.params(MongoIdDto),
      controller.getMethod('update'),
    )
    .delete(validate.params(MongoIdDto), controller.getMethod('delete'));

  return router;
};
