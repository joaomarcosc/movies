import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBodyRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      const error = err as { errors: string[] };
      res.status(400).json({ error: error.errors });
    }
  };
