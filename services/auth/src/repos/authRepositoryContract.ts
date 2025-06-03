import { Insertable, Selectable } from 'kysely';
import { User } from '../db/generated';

export interface AuthRepositoryContract {
  findUserById: (userId: string) => Promise<Selectable<User> | undefined>;
  findUserByName: (userName: string) => Promise<Selectable<User> | undefined>;
  findUserByEmail: (userEmail: string) => Promise<Selectable<User> | undefined>;
  createUser: (
    userData: Insertable<User>,
  ) => Promise<Selectable<User> | undefined>;
  deleteUser: (userId: string) => Promise<void>;
  activateAccount: (email: string, token: string) => Promise<void>;
  verifyAccount: (email: string, password: string) => Promise<Selectable<User>>;
}
