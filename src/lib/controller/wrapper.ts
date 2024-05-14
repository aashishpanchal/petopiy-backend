import { container } from 'tsyringe';
import { HttpRes } from '../response';
import {
  Context,
  ReqHandler,
  Constructor,
  ReqCtxHandler,
} from '../interfaces/factory.interface';
import { Response } from 'express';

// Wrapper function for request handlers.
export function wrapper(func: ReqHandler): ReqHandler;

// Wrapper function for request handlers with additional services.
export function wrapper<T extends Constructor<any>[]>(
  func: ReqCtxHandler<Context<T>>,
  ...services: T
): ReqHandler;

// Implementation of the wrapper function.
export function wrapper<T extends Constructor<any>[]>(
  func: any,
  ...services: T
): ReqHandler {
  // Resolve all services from the container.
  const context: InstanceType<any>[] = services.map(container.resolve);

  // Main wrapper function.
  return (req, res, next) => {
    try {
      // Execute the function with or without context based on the provided arguments.
      const result = context.length
        ? func(context, req, res, next)
        : func(req, res, next);

      // Handle promises or regular values returned by the function.
      if (result instanceof Promise)
        result.then((value: any) => handleResult(value, res)).catch(next);
      else handleResult(result, res);
    } catch (error) {
      next(error);
    }
  };
}

// Handles the result returned by the wrapped function.
function handleResult(result: unknown, res: Response): void {
  if (HttpRes.isHttpRes(result)) res.status(result.statusCode).json(result);
  else if (result && result !== res) res.send(result);
}
