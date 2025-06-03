import db from '../configs/database';
import { UserRepositoryContract } from './userRepositoryContract';

export class UserRepository implements UserRepositoryContract {
  async listAllUsersEmail() {
    const users = await db.selectFrom('user').select(['email']).execute();

    return users;
  }
}
