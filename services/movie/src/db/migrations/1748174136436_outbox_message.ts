import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('outbox_message')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('to', 'varchar', (col) => col.notNull())
    .addColumn('message', 'jsonb', (col) => col.notNull())
    .addColumn('type', 'varchar', (col) => col.notNull())
    .addColumn('publishedAt', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('runAfter', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('retryCount', 'integer', (col) => col.defaultTo(0).notNull())
    .addColumn('createdAt', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('outbox_message').execute();
}
