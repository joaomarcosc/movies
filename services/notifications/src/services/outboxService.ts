import { start } from 'repl';
import db from '../configs/database';
import { startOfDay, startOfToday } from 'date-fns';
import { AlertMovieReleasePayload } from '../models';
import { getUTCDate } from '../utils/helpers';
import { EmailService } from './emailService';

export class NotificationService {
  async enqueueNotification(data: AlertMovieReleasePayload): Promise<void> {
    const payload = {
      body: JSON.stringify({
        message: data.content.description,
      }),
      title: data.content.title,
      retryCount: 0,
      type: 'alertMovieReleaseEmail',
      runAfter: getUTCDate(startOfDay(data.content.releaseDate)),
    };

    await db.transaction().execute(async (trx) => {
      return trx.insertInto('notification').values(payload).execute();
    });
  }
  async processNotificationService() {
    const emailService = new EmailService();

    await db.transaction().execute(async (trx) => {
      const today = startOfToday();

      const messages = await trx
        .selectFrom('notification')
        .where((eb) => eb.and([eb('runAfter', '<=', today)]))
        .orderBy('runAfter', 'asc')
        .limit(100)
        .forUpdate()
        .skipLocked()
        .selectAll()
        .execute();

      const users = await trx.selectFrom('user').select(['email']).execute();

      for (const data of messages) {
        const { id, body, title, runAfter, retryCount } = data;

        try {
          console.log(`Processing notification ${id} with title: ${title}`);
          for (const user of users) {
            await emailService.sendAlertMovieReleaseEmail({
              email: user.email,
              content: {
                title: title,
                description: body,
                releaseDate: runAfter.toDateString(),
              },
            });
          }

          await trx.deleteFrom('notification').where('id', '=', id).execute();
        } catch (error) {
          console.error(`Error processing notification ${id}:`, error);
          await trx
            .updateTable('notification')
            .set({ retryCount: retryCount + 1 })
            .where('id', '=', id)
            .execute();
        }
      }
    });
  }
}
