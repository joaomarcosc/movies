import nodemailer from 'nodemailer';
import { ActivationEmailPayload, AlertMovieReleasePayload } from '../models';
import { NotificationService } from './outboxService';
import {
  EMAIL_AUTH_PASS,
  EMAIL_AUTH_USER,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
} from '../utils/constants';

export class EmailService {
  private transporterConfig() {
    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_SECURE,
      auth: {
        user: EMAIL_AUTH_USER,
        pass: EMAIL_AUTH_PASS,
      },
    });
  }

  public async sendActivationEmail(
    data: ActivationEmailPayload,
  ): Promise<void> {
    try {
      const activationLink = `${process.env.FRONTEND_URL}/activate/${data.token}`;

      const transporterConfig = this.transporterConfig();

      console.log('Sending activation email to:', data.email);

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: data.email,
        subject: 'Account Activation',
        html: `<p>Click the link below to activate your account:</p>
             <a href="${activationLink}">Activate Account</a>`,
      };

      await transporterConfig.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending activation email:', error);
    }
  }

  public async sendAlertMovieReleaseEmail(
    data: Omit<AlertMovieReleasePayload, 'releaseDate'>,
  ) {
    const transporterConfig = this.transporterConfig();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: data.email,
      subject: `New Movie Release: ${data.content.title}`,
      html: `<p
        <strong>${data.content.title}</strong> is releasing on ${data.content.releaseDate}.</p>
        <p>${data.content.description}</p>
        <p>Don't miss it!</p>
        <p>Visit our website for more details.</p>
        `,
    };

    await transporterConfig.sendMail(mailOptions);
  }

  public async alertMovieReleaseEmail(
    data: AlertMovieReleasePayload,
  ): Promise<void> {
    try {
      const notificationService = new NotificationService();
      await notificationService.enqueueNotification(data);
    } catch (error) {
      console.error('Error sending released movie email:', error);
    }
  }
}

export const emailService = new EmailService();
