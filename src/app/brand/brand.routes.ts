import { Router } from 'express';
import { MongoIdDto } from '../shared';
import { validate } from '@/middlewares';
import { JwtAuth, onlyAdmin } from '../auth';
import { controllerFactory } from '@/lib/controller';
import { BrandController } from './brand.controller';
import { CreateBrandDto, UpdateBrandDto } from './brand.dtos';

export const brandRoutes = () => {
  const router: Router = Router();
  // create controller
  const controller = controllerFactory(BrandController);
  // middlewares
  router.use(JwtAuth, onlyAdmin);
  // initialize router
  router
    .route('/')
    .post(validate.body(CreateBrandDto), controller.getMethod('create'));
  router
    .route('/:id')
    .get(validate.params(MongoIdDto), controller.getMethod('get'))
    .put(
      validate.body(UpdateBrandDto),
      validate.params(MongoIdDto),
      controller.getMethod('update'),
    )
    .delete(validate.params(MongoIdDto), controller.getMethod('delete'));

  return router;
};
