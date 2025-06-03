import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../@types/jwtPayload';

export const authenticate = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const token = request.headers.authorization;

    if (!token) {
      response.status(401).json({ message: 'No token provided' });
    }

    if (token) {
      const bearerToken = token.split(' ')[1];

      const decoded = jwt.verify(
        bearerToken,
        process.env.JWT_SECRET as string,
      ) as JwtPayload;

      console.log('Decoded JWT Payload:', decoded);

      request.user = decoded;
      next();
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    response.status(401).json({ message: error });
  }
};
