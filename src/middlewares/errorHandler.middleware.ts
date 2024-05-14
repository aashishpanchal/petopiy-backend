import logger from '@repo/logger';
import httpStatus from 'http-status';
import { RequestHandler, ErrorRequestHandler } from 'express';
import { HttpError, InternalServerError, NotFoundError } from '@/lib/errors';

// middleware handle errors
export class ErrorHandler {
  globalError: ErrorRequestHandler = (err, req, res, next) => {
    // http errors
    if (HttpError.isHttpError(err))
      return res.status(err.status).json(err.body);

    // console on error
    logger.error(err);

    // unknown errors
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(new InternalServerError(err.message).body);
  };

  notFound: RequestHandler = (req, res) => {
    // not found error
    const error = new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`);
    // response
    res.status(error.status).json(error.body);
  };
}

export const errorHandler = new ErrorHandler();
