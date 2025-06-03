import { Pool, PoolConfig } from 'pg';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { DB } from '../db/generated';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from '../utils/constants';

const poolConfig: PoolConfig = {
  database: DB_NAME,
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
};

const pool = new Pool(poolConfig);

const dialect = new PostgresDialect({
  pool,
});

const db = new Kysely<DB>({
  dialect,
  plugins: [new CamelCasePlugin()],
});

export { pool, dialect };
export default db;
