// Services Infos
export const PORT = process.env.PORT || 3000;
export const HOST = process.env.HOST || 'localhost';
export const NODE_ENV = process.env.NODE_ENV || 'development';

// DB
export const DB_NAME = process.env.DB_NAME || 'auth_db';
export const DB_HOST = process.env.PG_HOST || 'localhost';
export const DB_PORT = Number(process.env.DB_PORT) || 5432;
export const DB_USER = process.env.DB_USER || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD || '1234';

// RabbitMQ
export const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
export const RABBITMQ_PORT = Number(process.env.RABBITMQ_PORT) || 5672;
export const RABBITMQ_USER = process.env.RABBITMQ_USER || 'guest';
export const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD || 'guest';
export const AMQP_URL = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

// Email
export const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.example.com';
export const EMAIL_PORT = Number(process.env.EMAIL_PORT) || 587;
export const EMAIL_SECURE = process.env.EMAIL_SECURE === 'true';
export const EMAIL_AUTH_USER = process.env.EMAIL_AUTH_USER || '';
export const EMAIL_AUTH_PASS = process.env.EMAIL_AUTH_PASS || '';
export const EMAIL_FROM = process.env.EMAIL_FROM || '';
