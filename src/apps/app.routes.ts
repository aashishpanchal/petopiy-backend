import { Router } from 'express';
import { authRoutes } from './auth';
import { userRoutes } from './user';

export const appRoutes = (): Router => {
  // make v1 router
  const router = Router();

  // api router are init
  router.use('/auth', authRoutes());
  router.use('/user', userRoutes());

  return router;
};
