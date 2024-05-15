import { Router } from 'express';
import { authRoutes } from './auth';
import { userRoutes } from './user';
import { mediaRoutes } from './media';
import { brandRoutes } from './brand';

export const appRoutes = (): Router => {
  // make v1 router
  const router = Router();

  // api router are init
  router.use('/user', userRoutes());
  router.use('/auth', authRoutes());
  router.use('/media', mediaRoutes());
  router.use('/brand', brandRoutes());

  return router;
};
