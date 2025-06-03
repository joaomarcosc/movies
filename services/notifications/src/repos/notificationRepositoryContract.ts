import { Insertable } from 'kysely';
import { Notification } from '../db/generated';

export interface NotificationRepositoryContract {
  create(
    data: Insertable<Notification>,
  ): Promise<Insertable<Notification> | undefined>;
}
