import { Insertable } from 'kysely';
import { db } from '../configs/database';
import { AppError } from '../errors';
import { verifyActivateAccountToken } from '../utils/activateAccountToken';
import { User } from '../db/generated';
import { compareSync } from 'bcrypt';
import { AuthRepositoryContract } from './authRepositoryContract';

export class AuthRepository implements AuthRepositoryContract {
  async findUserById(userid: string) {
    const user = await db
      .selectFrom('user')
      .where('id', '=', userid)
      .selectAll()
      .executeTakeFirst();

    return user;
  }

  async findUserByName(userName: string) {
    const user = await db
      .selectFrom('user')
      .where('name', '=', userName)
      .selectAll()
      .executeTakeFirst();

    return user;
  }

  async findUserByEmail(userEmail: string) {
    const user = await db
      .selectFrom('user')
      .where('email', '=', userEmail)
      .selectAll()
      .executeTakeFirst();

    return user;
  }

  async createUser(userData: Insertable<User>) {
    const existingUser = await this.findUserByEmail(userData.email);

    if (existingUser) {
      throw new AppError(409, 'User already exists');
    }

    const user = await db
      .insertInto('user')
      .values(userData)
      .returningAll()
      .executeTakeFirst();

    return user;
  }

  async activateAccount(email: string, token: string) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    verifyActivateAccountToken(token, (err) => {
      if (err) {
        this.deleteUser(user.id);
        throw new AppError(403, 'Invalid token');
      }
    });

    if (user.isActive) {
      throw new AppError(409, 'Account already activated');
    }

    await db
      .updateTable('user')
      .set({ isActive: true })
      .where('email', '=', email)
      .execute();
  }

  async deleteUser(userId: string) {
    const user = await this.findUserById(userId);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    await db.deleteFrom('user').where('id', '=', userId).execute();
  }

  async verifyAccount(email: string, password: string) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (!user.isActive) {
      throw new AppError(403, 'Account not activated');
    }

    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid password');
    }

    return user;
  }
}
