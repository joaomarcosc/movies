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

// AWS S3
export const AWS_S3_REGION = process.env.AWS_S3_REGION || 'us-east-1';
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || 'your-bucket-name';
export const AWS_ACCESS_KEY_ID =
  process.env.AWS_ACCESS_KEY_ID || 'your-access-key';
export const AWS_SECRET_ACCESS_KEY =
  process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-access-key-id';

// RabbitMQ
export const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
export const RABBITMQ_PORT = Number(process.env.RABBITMQ_PORT) || 5672;
export const RABBITMQ_USER = process.env.RABBITMQ_USER || 'guest';
export const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD || 'guest';
export const AMQP_URL = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;
