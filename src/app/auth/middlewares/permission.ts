import { RoleEnum } from '@/constants';
import { wrapper } from '@/lib/controller';
import { ForbiddenError } from '@/lib/errors';
import { RequestHandler } from 'express';

export const permission = (...roles: RoleEnum[]) =>
  wrapper(async (req, _, next) => {
    const { user } = req;

    if (!roles) return true;

    if (!user) return false;

    const checker = user && roles.includes(user.role);

    if (!checker)
      throw new ForbiddenError(
        `User have not permission to access ${req.originalUrl}`,
      );

    next();
  });

export const onlyAdmin: RequestHandler = permission(RoleEnum.ADMIN);

export const adminOrSeller: RequestHandler = permission(
  RoleEnum.ADMIN,
  RoleEnum.VENDOR,
);
