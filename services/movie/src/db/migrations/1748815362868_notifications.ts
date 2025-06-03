import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('notification')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('runAfter', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('type', 'varchar', (col) => col.notNull())
    .addColumn('title', 'varchar', (col) => col.notNull())
    .addColumn('body', 'text', (col) => col.notNull())
    .addColumn('retryCount', 'integer', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updatedAt', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('notification').execute();
}
