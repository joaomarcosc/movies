import { activateAccountToken } from '../utils/activateAccountToken';
import { MAX_REFRESH_TOKEN_AGE, NODE_ENV } from '../utils/constants';
import { hashSync } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { AuthRepositoryContract } from '../repos/authRepositoryContract';
import RabbitMQConection from '../services/rabbitMQConnection';
import { AppError } from '../errors';
import { createToken, verifyToken } from '../utils/token';
import { isProduction } from '../utils/helper';

export class AuthController {
  private authRepository: AuthRepositoryContract;
  private FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

  constructor(authRepository: AuthRepositoryContract) {
    this.authRepository = authRepository;
  }

  public createUser = async (
    request: Request<any>,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, email, password } = request.body;
      const hashedPassword = hashSync(password, 10);
      const activationToken = activateAccountToken(email);
      const rabbitmqConnection = new RabbitMQConection();

      await rabbitmqConnection.connect();

      await this.authRepository.createUser({
        email,
        password: hashedPassword,
        name,
      });

      await rabbitmqConnection.sendToQueue(
        'activationEmail',
        JSON.stringify({
          email,
          token: activationToken,
        }),
      );

      response.status(201).json({
        message:
          'User created successfully. Please check your email to activate your account.',
      });
    } catch (error) {
      next(error);
    }
  };

  public signInUser = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, password } = request.body;

      const user = await this.authRepository.verifyAccount(email, password);

      const token = createToken(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        this.FIFTEEN_MINUTES_MS,
      );

      const refreshToken = createToken({ userId: user.id });

      response
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: isProduction ? true : false,
          sameSite: isProduction ? true : false,
          maxAge: MAX_REFRESH_TOKEN_AGE,
        })
        .status(200)
        .json({
          message: 'User signed in successfully',
          token,
        });
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const { refreshToken } = request.cookies;

    if (!refreshToken) {
      throw new AppError(401, 'No refresh token provided');
    }
    try {
      const decoded = verifyToken(refreshToken) as {
        userId: string;
      };

      const user = await this.authRepository.findUserById(decoded.userId);

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      const newRefreshToken = createToken({ userId: decoded.userId });

      const newToken = createToken(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        this.FIFTEEN_MINUTES_MS,
      );

      response
        .cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: MAX_REFRESH_TOKEN_AGE,
        })
        .status(200)
        .json({
          message: 'Token refreshed successfully',
          token: newToken,
        });
    } catch (error) {
      next(error);
    }
  };

  public signOutUser = async (
    _request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      response
        .clearCookie('refreshToken', {
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
        })
        .status(200)
        .json({
          message: 'User signed out successfully',
        });
    } catch (error) {
      next(error);
    }
  };

  public activateAccount = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = request.body;
      const { token } = request.params;

      await this.authRepository.activateAccount(email, token);

      response.status(200).json({
        message: 'Account activated successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
