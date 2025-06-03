// Services Infos
export const PORT = process.env.PORT || 3000;
export const HOST = process.env.HOST || 'localhost';
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Cookies
export const MAX_REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000;

// JWT
export const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';

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
