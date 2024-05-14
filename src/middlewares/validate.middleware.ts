import httpStatus from 'http-status';
import { wrapper } from '@/lib/controller';
import { AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from '@/lib/errors';

const validateFn = (schema: AnyZodObject, type: 'body' | 'query' | 'params') =>
  wrapper(async (req, _, next) => {
    try {
      req[type] = await schema.parseAsync(req[type]);
      // call next
      next();
    } catch (error) {
      // zod error
      if (error instanceof ZodError)
        throw new BadRequestError({
          message: error.errors,
          statusCode: httpStatus.BAD_REQUEST,
          error: 'Validation Error',
        });

      // unknown error
      throw error;
    }
  });

export const validate = {
  // only body validator
  body: (schema: AnyZodObject) => validateFn(schema, 'body'),
  // only query validator
  query: (schema: AnyZodObject) => validateFn(schema, 'query'),
  // only params validator
  params: (schema: AnyZodObject) => validateFn(schema, 'params'),
};
