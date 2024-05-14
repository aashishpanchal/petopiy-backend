import { Router } from 'express';
import { authRoutes } from './auth';
import { userRoutes } from './user';
import { bucketRoutes } from './bucket';

export const appRoutes = (): Router => {
  // make v1 router
  const router = Router();

  // api router are init
  router.use('/user', userRoutes());
  router.use('/auth', authRoutes());
  router.use('/bucket', bucketRoutes());

  return router;
};
