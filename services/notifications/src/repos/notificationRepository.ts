import { Insertable } from 'kysely';
import db from '../configs/database';
import { Notification } from '../db/generated';
import { NotificationRepositoryContract } from './notificationRepositoryContract';

export default class NotificationRepository
  implements NotificationRepositoryContract
{
  async create(data: Insertable<Notification>) {
    const notification = await db
      .insertInto('notification')
      .values(data)
      .returningAll()
      .executeTakeFirst();

    return notification;
  }
}
