import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './constants';

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET ?? '');
};

export const createToken = <T extends string | object | Buffer>(
  payload: T,
  expiresIn?: number,
) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  });
};
