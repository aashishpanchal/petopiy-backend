import { Router } from 'express';
import { JwtAuth } from '../auth';
import { MongoIdDto } from '../shared';
import { UploadFileDto } from './bucket.dtos';
import { upload, validate } from '@/middlewares';
import { controllerFactory } from '@/lib/controller';
import { BucketController } from './bucket.controller';

export const bucketRoutes = (): Router => {
  // make v1 router
  const router = Router();
  // create controller
  const controller = controllerFactory(BucketController);
  // middlewares
  router.use(JwtAuth);
  // initialize router
  router
    .route('/')
    .post(
      validate.query(UploadFileDto),
      upload.single('file'),
      controller.getMethod('upload'),
    );
  router
    .route('/:id')
    .put(
      validate.params(MongoIdDto),
      upload.single('file'),
      controller.getMethod('update'),
    )
    .delete(validate.params(MongoIdDto), controller.getMethod('delete'));

  return router;
};
