import amqpClient from 'amqplib';
import type { Channel } from 'amqplib';
import { AMQP_URL } from '../utils/constants';

class RabbitMQConection {
  channel!: Channel;
  public connected!: boolean;

  public constructor() {}

  async connect() {
    if (this.connected && this.channel) {
      return;
    }
    try {
      console.log(`⌛️ Connecting to RabbitMQ Server`);

      const channelMode = await amqpClient.connect(AMQP_URL);
      this.channel = await channelMode.createChannel();
      this.connected = true;
    } catch (error) {
      console.error('Error connecting to message broker:', error);
      throw error;
    }
  }

  async sendToQueue(queue: string, message: string) {
    try {
      if (this.connected) {
        console.log(`⌛️ Preparing to send message to queue: ${queue}`);
        console.log(`⌛️ Sending message to queue: ${queue}`);
        console.log(`⌛️ Message: ${message}`);
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(message));
        console.log(`✅ Message sent to queue: ${queue}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default RabbitMQConection;
