import dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import app from './app';
import { PORT } from './utils/constants';
import { RabbitMQConnection } from './services/rabbitMQConnection';
import { NotificationService } from './services/outboxService';

async function bootstrap() {
  const rabbitMQConnetion = new RabbitMQConnection();
  const notificationService = new NotificationService();

  await rabbitMQConnetion.connect();
  await rabbitMQConnetion.consumeQueue('activationEmail');
  await rabbitMQConnetion.consumeQueue('alertMovieReleaseEmail');

  cron.schedule('0 0 * * * *', () => {
    console.log('Running notification service processing task');
    notificationService.processNotificationService().catch((error) => {
      console.error('Error processing notifications:', error);
    });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Notification was running at port: ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
