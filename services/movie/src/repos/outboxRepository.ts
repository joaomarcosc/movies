import { Insertable } from 'kysely';
import { OutboxMessage } from '../db/generated';
import { db } from '../configs/database';

export class OutboxRepository {
  save = async (data: Insertable<OutboxMessage>) => {
    return await db
      .insertInto('outboxMessage')
      .values(data)
      .returningAll()
      .executeTakeFirst();
  };
}
