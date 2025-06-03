import { defineConfig } from 'kysely-ctl';
import { CamelCasePlugin } from 'kysely';
import { pool } from './src/configs/database';

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
