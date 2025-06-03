import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { env } from 'process';

export const activateAccountToken = (email: string) => {
  return jwt.sign({ data: email }, env.JWT_SECRET as string, {
    expiresIn: 20 * 60,
  });
};

export const verifyActivateAccountToken = (
  token: string,
  errorCallback?: (
    err: VerifyErrors | null,
    decoded?: string | JwtPayload,
  ) => void,
) => {
  if (errorCallback) {
    jwt.verify(token, env.JWT_SECRET ?? '', errorCallback);
    return;
  }

  return jwt.verify(token, env.JWT_SECRET ?? '');
};
