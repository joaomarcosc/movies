import { defineConfig } from 'kysely-ctl';
import { pool } from './src/configs/database';
import { CamelCasePlugin } from 'kysely';

export default defineConfig({
  dialect: 'pg',
  plugins: [new CamelCasePlugin()],
  dialectConfig: {
    pool,
  },
  migrations: {
    migrationFolder: './src/db/migrations',
  },
});
