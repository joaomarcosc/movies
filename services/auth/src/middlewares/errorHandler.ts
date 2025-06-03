import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
    });

    return;
  }

  console.error(err);

  res.status(500).json({
    message: 'Internal server error',
  });
};
