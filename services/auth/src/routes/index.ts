import { Router } from 'express';
import { AuthController } from '../controllers';
import {
  activateAccountSchema,
  createUserSchema,
  loginSchema,
} from '../schemas';
import { validateBodyRequest } from '../middlewares/validateBodyRequest';
import { AuthRepository } from '../repos/authRepository';

export class AuthRoutes {
  public router: Router;
  private controller: AuthController;

  constructor() {
    this.router = Router();
    const authRepository = new AuthRepository();
    this.controller = new AuthController(authRepository);
    this.routes();
  }

  private routes(): void {
    this.router.post(
      '/signup',
      validateBodyRequest(createUserSchema),
      this.controller.createUser,
    );

    this.router.post(
      '/signin',
      validateBodyRequest(loginSchema),
      this.controller.signInUser,
    );

    this.router.post('/signout', this.controller.signOutUser);

    this.router.patch(
      '/activate/:token',
      validateBodyRequest(activateAccountSchema),
      this.controller.activateAccount,
    );

    this.router.post('/refreshToken', this.controller.refreshToken);
  }
}
