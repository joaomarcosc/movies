import { Insertable } from 'kysely';
import { db } from '../configs/database';
import { OutboxMessage } from '../db/generated';
import { RabbitMQConnection } from './rabbitMQConnection';
import { OutboxRepository } from '../repos/outboxRepository';
import { addMinutes } from 'date-fns';
import { getUTCDate } from '../utils';
import { get } from 'http';
import { OutboxMessageType } from '../@types/outbox';

/**
 * OutboxService is responsible for processing outbox messages.
 * It will read messages from the outbox table and send them to the appropriate message queue.
 */
export class OutboxService {
  private rabbitMQConnection: RabbitMQConnection;
  private outboxRepository: OutboxRepository;

  constructor(
    outboxRepository: OutboxRepository,
    rabbitMQConnection: RabbitMQConnection,
  ) {
    this.rabbitMQConnection = rabbitMQConnection;
    this.outboxRepository = outboxRepository;
  }

  private nextRetryDate = (currentDate: Date, retryCount: number): Date => {
    const delay = Math.pow(2, retryCount) * 1000;
    return new Date(currentDate.getTime() + delay);
  };

  /**
   * Enqueue a message to the outbox table.
   * @param queue The name of the queue to send the message to.
   * @param payload The message payload to be sent.
   */
  enqueueMessages = async (
    to: string,
    payload: OutboxMessageType,
  ): Promise<void> => {
    const { content, email, runAfter } = payload;

    const message = JSON.stringify({
      content,
      email,
    });

    console.log(
      `Enqueuing message to ${to} with content: ${JSON.stringify(content)}`,
    );

    const releaseDateUTC = getUTCDate(new Date(content.releaseDate));

    const outboxMessage: Insertable<OutboxMessage> = {
      to,
      type: 'email',
      message: message,
      runAfter: runAfter
        ? getUTCDate(runAfter)
        : addMinutes(getUTCDate(new Date()), 3),
      publishedAt:
        releaseDateUTC.getTime() < Date.now() ? content.releaseDate : null,
      retryCount: 0,
    };

    await this.outboxRepository.save(outboxMessage);
  };

  processOutbox = async () => {
    const rabbitMQConnection = this.rabbitMQConnection;
    const date = getUTCDate(new Date());

    await db.transaction().execute(async (trx) => {
      const messages = await trx
        .selectFrom('outboxMessage')
        .where((eb) =>
          eb.and([eb('publishedAt', 'is', null), eb('runAfter', '<=', date)]),
        )
        .orderBy('runAfter', 'asc')
        .limit(100)
        .forUpdate()
        .skipLocked()
        .selectAll()
        .execute();

      console.log(`Found ${messages.length} messages to process.`);

      for (const data of messages) {
        const { id, to, message, retryCount = 0 } = data;

        try {
          await rabbitMQConnection.sendToQueue(to, JSON.stringify(message));
          await trx
            .updateTable('outboxMessage')
            .set({ publishedAt: new Date() })
            .where('id', '=', id)
            .execute();
        } catch (error) {
          console.error(`Failed to send message ${id}:`, error);

          const nextRunAfter = this.nextRetryDate(new Date(), retryCount);

          await trx
            .updateTable('outboxMessage')
            .set({ runAfter: nextRunAfter, retryCount: retryCount + 1 })
            .where('id', '=', id)
            .execute();
        }
      }
    });
  };
}
