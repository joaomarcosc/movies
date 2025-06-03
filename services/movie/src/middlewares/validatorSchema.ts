import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validateBodyRequest =
  (schema: ZodSchema) =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      request.body = schema.parse(request.body);
      next();
    } catch (err) {
      const error = err as { errors: string[] };
      response.status(400).json({ error: error.errors });
    }
  };
