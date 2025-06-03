import { Pool } from 'pg';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { DB } from '../db/generated';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from '../utils/constants';

export const pool = new Pool({
  database: DB_NAME,
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
});

const dialect = new PostgresDialect({
  pool,
});

// Check if exists any plugin to run migrations in runtime
export const db = new Kysely<DB>({
  dialect,
  plugins: [new CamelCasePlugin()],
});
