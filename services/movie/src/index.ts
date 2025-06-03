import env from 'dotenv';
env.config();

import cron from 'node-cron';
import app from './app';
import { RabbitMQConnection } from './service/rabbitMQConnection';
import { OutboxService } from './service/outboxService';
import { OutboxRepository } from './repos/outboxRepository';

async function bootstrap() {
  const rabbitMQConnetion = new RabbitMQConnection();
  await rabbitMQConnetion.connect();

  if (rabbitMQConnetion.connected) {
    cron.schedule('*/10 * * * * *', () => {
      const outboxService = new OutboxService(
        new OutboxRepository(),
        rabbitMQConnetion,
      );

      outboxService.processOutbox().catch((error) => {
        console.error('Error processing outbox:', error);
      });
    });
  }

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Movie was running at port: ${process.env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
