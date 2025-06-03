import amqpClient from 'amqplib';
import type { Channel } from 'amqplib';
import { emailService } from './emailService';
import { ActivationEmailPayload, AlertMovieReleasePayload } from '../models';
import { AMQP_URL } from '../utils/constants';

type QueueMap = {
  activationEmail: ActivationEmailPayload;
  alertMovieReleaseEmail: AlertMovieReleasePayload;
};

type QueuePayload<T extends keyof QueueMap> = QueueMap[T];

export class RabbitMQConnection {
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

  async getChannel() {
    if (!this.channel) {
      throw new Error('Channel is not initialized. Call connect() first.');
    }
    return this.channel;
  }

  async consumeQueue(queue: keyof QueueMap) {
    await this.channel.assertQueue(queue, {
      durable: true,
    });

    console.log(`[AMQP] Queue ${queue} is ready to consume`);

    this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());

        if (!data) throw new Error('Invalid activateAccount payload');

        await this.sendMessage(queue, data);
        this.channel.ack(msg);
      } catch (err) {
        console.error('[Consumer] Error on process message:', err);
        this.channel.nack(msg, false, false);
      }
    });

    console.log(`[AMQP] Consuming queue: ${queue}`);
  }

  private async sendMessage<T extends keyof QueueMap>(
    queue: T,
    payload: QueuePayload<T>,
  ) {
    console.log(`[AMQP] Sending message to queue: ${queue}`, payload);

    switch (queue) {
      case 'activationEmail':
        return this.handleActivationEmail(payload as ActivationEmailPayload);
      case 'alertMovieReleaseEmail':
        return this.handleAlertMovieReleaseEmail(
          payload as AlertMovieReleasePayload,
        );
      default:
        throw new Error(`Unknown queue type: ${queue}`);
    }
  }

  private async handleActivationEmail(payload: ActivationEmailPayload) {
    return emailService.sendActivationEmail(payload);
  }

  private async handleAlertMovieReleaseEmail(
    payload: AlertMovieReleasePayload,
  ) {
    return emailService.alertMovieReleaseEmail(payload);
  }
}
