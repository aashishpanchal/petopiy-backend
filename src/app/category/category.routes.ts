import { Router } from 'express';
import { MongoIdDto } from '../shared';
import { validate } from '@/middlewares';
import { JwtAuth, onlyAdmin } from '../auth';
import { controllerFactory } from '@/lib/controller';
import { CategoryController } from './category.controller';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dtos';

export const categoryRoutes = () => {
  const router: Router = Router();
  // create controller
  const controller = controllerFactory(CategoryController);
  // middlewares
  router.use(JwtAuth, onlyAdmin);
  // initialize router
  router
    .route('/')
    .post(validate.body(CreateCategoryDto), controller.getMethod('create'));
  router
    .route('/:id')
    .get(validate.params(MongoIdDto), controller.getMethod('get'))
    .put(
      validate.body(UpdateCategoryDto),
      validate.params(MongoIdDto),
      controller.getMethod('update'),
    )
    .delete(validate.params(MongoIdDto), controller.getMethod('delete'));

  return router;
};
