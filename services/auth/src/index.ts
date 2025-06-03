import { config } from 'dotenv';
config();

import app from './app';
import RabbitMQConnection from './services/rabbitMQConnection';
import { PORT } from './utils/constants';

async function bootstrap() {
  const rabbitMQConnection = new RabbitMQConnection();
  await rabbitMQConnection.connect();

  await rabbitMQConnection.channel.assertQueue('activationEmail', {
    durable: true,
  });

  app.listen(PORT, () => {
    console.log(`🚀 Auth was running at port: ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
